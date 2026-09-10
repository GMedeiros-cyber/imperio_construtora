/**
 * Gera /public/og/imperio-og.jpg, a imagem de compartilhamento (og:image).
 *
 *   node scripts/gera-og.mjs
 *
 * ══ O QUE O SCRIPT FAZ, E POR QUE CADA COISA ══
 *
 * 1. PARTE DA FOTO LARGA DA HERO JÁ TRATADA (public/hero/hero-wide.jpg) e
 *    recorta em 1200x630, a proporção 1,91:1 que WhatsApp, Facebook, LinkedIn e
 *    X esperam. O recorte ancora na BASE (position "bottom"): o que se perde são
 *    45px de céu no topo, e o escurecimento que já vem gravado na base da foto
 *    fica inteiro.
 *
 * 2. ESCURECE A BASE, gravado no arquivo e não por CSS, a mesma regra das fotos
 *    da hero. O escurecimento que a hero traz foi calculado para o texto do
 *    site e só alcança os últimos ~30px do quadro; a logo tem 128px de altura e
 *    precisava de mais. É uma rampa de 0 a VEU entre y=300 e o topo da logo, e
 *    constante dali para baixo.
 *
 * 3. SOBREPÕE A LOGO em 1:1, no canto inferior esquerdo, com 48px de margem. É
 *    a MESMA PNG da hero (160x128) e não há versão maior: ampliar borraria o
 *    traço. O canto inferior esquerdo é onde a foto já é mais escura (grama e
 *    samambaias); o superior esquerdo, onde a logo mora na hero, pegaria o topo
 *    branco da fachada neste recorte e precisaria de véu de 0,7 para passar.
 *
 * 4. MEDE O ARQUIVO JÁ CODIFICADO, e não o buffer antes do JPEG. A medição é
 *    estrita: o pixel dourado MAIS ESCURO do miolo da logo contra o pixel de
 *    fundo MAIS CLARO da caixa dela. Tem de dar 3:1 — é gráfico, não texto.
 *
 *    ⚠ QUEM PERDE CONTRASTE NO JPEG É A LOGO, NÃO O FUNDO. Sem compressão, véu
 *    de 0,4 já dava 3,40:1; codificado, o mesmo véu cai para 2,57:1, porque o
 *    traço dourado tem 1 a 2px e a compressão o escurece. 4:4:4 não ajuda
 *    (mediu pior, 3,36 contra 3,40 a 0,55). Por isso o VEU é 0,55, e não 0,4.
 *
 * ⚠ TROCOU A FOTO, A LOGO OU O RECORTE, RODE DE NOVO E REMEÇA. O VEU vale para
 *    ESTA imagem. O script sai com erro se o contraste ficar abaixo de 3:1.
 */

import sharp from "sharp";
import { PNG } from "pngjs";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const FOTO = path.join(raiz, "public/hero/hero-wide.jpg");
const LOGO = path.join(raiz, "public/hero/logo-imperio-nav.png");
const SAIDA = path.join(raiz, "public/og/imperio-og.jpg");

const LARGURA = 1200;
const ALTURA = 630;
const MARGEM = 48;

/* Alfa máximo do véu preto na base. 0,55 foi o menor valor com folga depois do
   JPEG: 3,40:1 medido no arquivo final. Este número é desta foto. */
const VEU = 0.55;
const RAMPA_INICIO = 300;

const logo = await sharp(LOGO).raw().toBuffer({ resolveWithObject: true });
const { width: lw, height: lh } = logo.info;
const lx = MARGEM;
const ly = ALTURA - MARGEM - lh;
const rampaFim = ly - 10;

/* Rampa suave (smoothstep), gerada pixel a pixel: tem de ficar DENTRO do
   arquivo, então gradiente CSS não serve. */
const veu = new PNG({ width: LARGURA, height: ALTURA });
for (let y = 0; y < ALTURA; y++) {
  const t = Math.min(1, Math.max(0, (y - RAMPA_INICIO) / (rampaFim - RAMPA_INICIO)));
  const alfa = Math.round(VEU * t * t * (3 - 2 * t) * 255);
  for (let x = 0; x < LARGURA; x++) veu.data[(y * LARGURA + x) * 4 + 3] = alfa;
}

fs.mkdirSync(path.dirname(SAIDA), { recursive: true });
await sharp(FOTO)
  .resize(LARGURA, ALTURA, { fit: "cover", position: "bottom" })
  .composite([
    { input: PNG.sync.write(veu), blend: "over" },
    { input: LOGO, left: lx, top: ly },
  ])
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(SAIDA);

/* ── Medição no arquivo gravado ── */
const linear = (c) => {
  c /= 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};
const { data } = await sharp(SAIDA).raw().toBuffer({ resolveWithObject: true });
const lum = (i) => 0.2126 * linear(data[i]) + 0.7152 * linear(data[i + 1]) + 0.0722 * linear(data[i + 2]);

let logoMin = 1;
let fundoMax = 0;
for (let y = 0; y < lh; y++) {
  for (let x = 0; x < lw; x++) {
    const alfa = logo.data[(y * lw + x) * 4 + 3];
    const l = lum(((ly + y) * LARGURA + lx + x) * 3);
    if (alfa === 255) logoMin = Math.min(logoMin, l);
    else if (alfa === 0) fundoMax = Math.max(fundoMax, l);
  }
}
const contraste = (logoMin + 0.05) / (fundoMax + 0.05);
const m = await sharp(SAIDA).metadata();
console.log(
  `imperio-og.jpg  ${m.width}x${m.height}  ${(fs.statSync(SAIDA).size / 1024).toFixed(0)} KB\n` +
    `logo L min ${logoMin.toFixed(3)} · fundo L max ${fundoMax.toFixed(3)} · contraste ${contraste.toFixed(2)}:1`,
);
if (contraste < 3) {
  console.error("REPROVA: a logo precisa de 3:1 sobre a foto. Suba o VEU.");
  process.exit(1);
}
