/**
 * Gera os ícones do site a partir da logo que já está no repositório.
 *
 *   node scripts/gera-icones.mjs
 *
 * Saída: public/favicon.ico (16+32+48) e public/icones/*.png, declarados em
 * `icons` no metadata de app/layout.tsx.
 *
 * ══ POR QUE SÓ A COROA ══
 *
 * A logo é coroa + "IMPÉRIO" + "CONSTRUTORA". A palavra tem 7 letras em 160px
 * de largura: a 16px cada letra fica com 1,4px e vira ruído. Fica a coroa, que
 * é a parte que identifica a marca sem precisar ser lida.
 *
 * ══ ⚠ O TRAÇO DA COROA NÃO SOBREVIVE A 16px SEM AJUDA ══
 *
 * Medido no arquivo: a coroa mede 139x84 e o traço tem MEDIANA DE 7px — 5,0%
 * da largura. Reduzida a 16px com a margem do ladrilho, isso dá 0,63px de
 * traço, e o resultado é que **nenhum pixel do ícone chega à cor cheia**:
 * medido, ZERO pixels com cobertura >= 0,9 a 16px. Tudo vira franja de
 * antialias sobre o ink, e é exatamente isso que se lê como mancha.
 *
 * A correção é ENGORDAR O TRAÇO, e engordar NA RESOLUÇÃO GRANDE — um filtro de
 * máximo sobre o alfa dos 139px, e só depois reduzir. Engordar já no tamanho
 * pequeno fecha os vãos e a coroa vira bolha (testado: a 16px o vão central
 * desaparecia por completo).
 *
 * O raio sai de conta, não de gosto: quanto é preciso engordar para o traço
 * final ter pelo menos ALVO_TRACO pixels cheios naquele tamanho. Por isso 16px
 * recebe muito e 48px não recebe nada — é espessura óptica, a mesma ideia de
 * um tipo que engorda nos corpos pequenos.
 *
 * ══ ⚠ O LADRILHO É INK OPACO, E ISSO NÃO É ESCOLHA DE GOSTO ══
 *
 * Dourado sobre transparente some numa das duas abas: sobre o creme claro o
 * #B79653 mede 2,7:1, abaixo dos 3:1 de objeto gráfico. E o AGENTS.md já diz
 * que o dourado só vive sobre fundo escuro. Com o ladrilho ink #0A0A0A o ícone
 * é o MESMO arquivo nas duas abas, e a marca mede 6,5:1 sobre ele.
 *
 * Sem cantos arredondados de propósito: o iOS aplica a própria máscara no
 * apple-touch-icon, e arredondar aqui deixaria uma borda dupla.
 */

import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const FONTE = path.join(raiz, "public/hero/logo-imperio-nav.png");

const INK = { r: 10, g: 10, b: 10 };
const GOLD = { r: 183, g: 150, b: 83 };
const GOLD_LT = { r: 212, g: 184, b: 114 };

/** Altura, na logo, onde a coroa acaba e começa a palavra "IMPÉRIO". */
const FIM_DA_COROA = 84;
/** Quanto do lado do ladrilho é margem, somando os dois lados. */
const MARGEM = 0.16;
/** Traço mínimo, em pixels cheios, no tamanho final. Abaixo disso some. */
const ALVO_TRACO = 1.4;

const ICONES = [
  { arquivo: "public/icones/icone-32.png", lado: 32 },
  { arquivo: "public/icones/icone-192.png", lado: 192 },
  { arquivo: "public/icones/apple-icon-180.png", lado: 180 },
];
/** Os três que entram no favicon.ico. É o que Windows e abas pedem. */
const DENTRO_DO_ICO = [16, 32, 48];

const lin = (c) => { const s = c / 255; return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4); };
const L = (r, g, b) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const razao = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

/* ── A coroa, recortada pelo conteúdo ──────────────────────────────────── */
const topo = await sharp(FONTE).ensureAlpha()
  .extract({ left: 0, top: 0, width: 160, height: FIM_DA_COROA })
  .raw().toBuffer({ resolveWithObject: true });
const { data: dTopo, info: iTopo } = topo;
let x0 = iTopo.width, x1 = 0, y0 = iTopo.height, y1 = 0;
for (let y = 0; y < iTopo.height; y++) {
  for (let x = 0; x < iTopo.width; x++) {
    if (dTopo[(y * iTopo.width + x) * iTopo.channels + 3] > 40) {
      if (x < x0) x0 = x;
      if (x > x1) x1 = x;
      if (y < y0) y0 = y;
      if (y > y1) y1 = y;
    }
  }
}
const LARGURA_COROA = x1 - x0 + 1;
const coroa = await sharp(FONTE).ensureAlpha()
  .extract({ left: x0, top: y0, width: LARGURA_COROA, height: y1 - y0 + 1 })
  .png().toBuffer();

/* Espessura do traço na origem: mediana das corridas horizontais de pixel
   opaco. É dela que sai o raio de cada tamanho. */
const corridas = [];
for (let y = 0; y <= y1 - y0; y += 2) {
  let n = 0;
  for (let x = 0; x < LARGURA_COROA; x++) {
    const a = dTopo[((y + y0) * iTopo.width + (x + x0)) * iTopo.channels + 3];
    if (a > 128) n++;
    else { if (n > 0) corridas.push(n); n = 0; }
  }
  if (n > 0) corridas.push(n);
}
corridas.sort((a, b) => a - b);
const TRACO = corridas[Math.floor(corridas.length / 2)];

/** Raio do filtro de máximo para o traço final ter ALVO_TRACO pixels. */
function raioPara(lado) {
  const escala = (1 - MARGEM) * lado / LARGURA_COROA;
  return Math.max(0, Math.ceil((ALVO_TRACO / escala - TRACO) / 2));
}

/** Filtro de máximo sobre o alfa: engorda o desenho por `r` pixels. */
async function engorda(buf, r) {
  if (r === 0) return buf;
  const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const saida = Buffer.from(data);
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      let max = 0;
      for (let dy = -r; dy <= r; dy++) {
        for (let dx = -r; dx <= r; dx++) {
          const yy = y + dy, xx = x + dx;
          if (yy < 0 || xx < 0 || yy >= info.height || xx >= info.width) continue;
          const a = data[(yy * info.width + xx) * info.channels + 3];
          if (a > max) max = a;
        }
      }
      saida[(y * info.width + x) * info.channels + 3] = max;
    }
  }
  return sharp(saida, { raw: { width: info.width, height: info.height, channels: info.channels } })
    .png().toBuffer();
}

/** Tinge o alfa com a rampa gold-lt -> gold da logo e assenta no ladrilho ink. */
async function ladrilho(lado) {
  const marcaGorda = await engorda(coroa, raioPara(lado));
  const cx = Math.round(lado * (1 - MARGEM));
  const reduzida = await sharp(marcaGorda).resize({ width: cx, height: cx, fit: "inside" }).toBuffer();
  const { data, info } = await sharp(reduzida).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const pintada = Buffer.alloc(info.width * info.height * 4);
  for (let k = 0; k < info.width * info.height; k++) {
    const t = 1 - Math.floor(k / info.width) / Math.max(1, info.height - 1);
    pintada[k * 4] = Math.round(GOLD.r + (GOLD_LT.r - GOLD.r) * t);
    pintada[k * 4 + 1] = Math.round(GOLD.g + (GOLD_LT.g - GOLD.g) * t);
    pintada[k * 4 + 2] = Math.round(GOLD.b + (GOLD_LT.b - GOLD.b) * t);
    pintada[k * 4 + 3] = data[k * info.channels + 3];
  }
  const marca = await sharp(pintada, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png().toBuffer();
  return sharp({ create: { width: lado, height: lado, channels: 4, background: { ...INK, alpha: 1 } } })
    .composite([{ input: marca, gravity: "center" }])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

/** Conta os pixels de cor CHEIA e mede o pior contraste entre eles e o ink. */
async function afere(png, lado) {
  const { data, info } = await sharp(png).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const lFundo = L(INK.r, INK.g, INK.b);
  const lMarca = L(GOLD.r, GOLD.g, GOLD.b);
  let cheios = 0, pior = Infinity;
  for (let k = 0; k < info.width * info.height; k++) {
    const r = data[k * info.channels], g = data[k * info.channels + 1], b = data[k * info.channels + 2];
    const cobertura = (L(r, g, b) - lFundo) / (lMarca - lFundo);
    if (cobertura < 0.9) continue;
    cheios++;
    const c = razao(L(r, g, b), lFundo);
    if (c < pior) pior = c;
  }
  return { cheios, pct: (100 * cheios) / (lado * lado), pior: Number.isFinite(pior) ? pior : null };
}

/* ── ICO: cabeçalho de 6 bytes, 16 por entrada, e PNG dentro ─────────────
   PNG dentro de ICO é lido por todo navegador atual e pelo Windows desde o
   Vista, e evita ter de escrever BMP com máscara AND. */
function montaIco(pngs) {
  const cabeca = Buffer.alloc(6);
  cabeca.writeUInt16LE(0, 0);
  cabeca.writeUInt16LE(1, 2);
  cabeca.writeUInt16LE(pngs.length, 4);
  let deslocamento = 6 + 16 * pngs.length;
  const entradas = [];
  for (const { lado, png } of pngs) {
    const e = Buffer.alloc(16);
    e.writeUInt8(lado >= 256 ? 0 : lado, 0);
    e.writeUInt8(lado >= 256 ? 0 : lado, 1);
    e.writeUInt8(0, 2);
    e.writeUInt8(0, 3);
    e.writeUInt16LE(1, 4);
    e.writeUInt16LE(32, 6);
    e.writeUInt32LE(png.length, 8);
    e.writeUInt32LE(deslocamento, 12);
    entradas.push(e);
    deslocamento += png.length;
  }
  return Buffer.concat([cabeca, ...entradas, ...pngs.map((p) => p.png)]);
}

fs.mkdirSync(path.join(raiz, "public/icones"), { recursive: true });

console.log(`coroa ${LARGURA_COROA}x${y1 - y0 + 1} recortada da logo; traço mediano ${TRACO}px (${((100 * TRACO) / LARGURA_COROA).toFixed(1)}% da largura)`);
console.log("\narquivo                          lado  engorda  traço final  px cheios  contraste sobre o ink");

const doIco = [];
for (const lado of DENTRO_DO_ICO) {
  const png = await ladrilho(lado);
  doIco.push({ lado, png });
  const a = await afere(png, lado);
  const tracoFinal = ((TRACO + 2 * raioPara(lado)) * (1 - MARGEM) * lado) / LARGURA_COROA;
  console.log(
    `  favicon.ico [${lado}]`.padEnd(33), String(lado).padStart(4), `+${raioPara(lado)}px`.padStart(8),
    `${tracoFinal.toFixed(2)}px`.padStart(12), `${a.cheios} (${a.pct.toFixed(0)}%)`.padStart(11),
    (a.pior ? a.pior.toFixed(2) + ":1" : "NENHUM PIXEL CHEIO").padStart(22),
  );
}
fs.writeFileSync(path.join(raiz, "public/favicon.ico"), montaIco(doIco));

for (const { arquivo, lado } of ICONES) {
  const png = await ladrilho(lado);
  fs.writeFileSync(path.join(raiz, arquivo), png);
  const a = await afere(png, lado);
  const tracoFinal = ((TRACO + 2 * raioPara(lado)) * (1 - MARGEM) * lado) / LARGURA_COROA;
  console.log(
    "  " + arquivo.padEnd(31), String(lado).padStart(4), `+${raioPara(lado)}px`.padStart(8),
    `${tracoFinal.toFixed(2)}px`.padStart(12), `${a.cheios} (${a.pct.toFixed(0)}%)`.padStart(11),
    (a.pior ? a.pior.toFixed(2) + ":1" : "NENHUM PIXEL CHEIO").padStart(22),
  );
}

const ico = fs.statSync(path.join(raiz, "public/favicon.ico"));
console.log(`\npublic/favicon.ico  ${DENTRO_DO_ICO.join("+")}  ${(ico.size / 1024).toFixed(1)} KB`);
