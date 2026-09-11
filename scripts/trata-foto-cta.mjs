/**
 * Gera /public/cta/canteiro-noturno.{jpg,webp} a partir do original.
 *
 *   node scripts/trata-foto-cta.mjs <caminho-do-original>
 *
 * ══ O QUE O SCRIPT FAZ, E POR QUE CADA COISA ══
 *
 * 1. RECORTA numa FAIXA de 3,7:1. O original é retrato 3024x4032 e o CTA é uma
 *    barra reta e baixa acima do rodapé; sem recorte o object-cover decidiria o
 *    enquadramento sozinho. A fatia escolhida pega o pavimento aceso e a base do
 *    guindaste, que é o que faz a foto ler como canteiro noturno.
 *
 * 2. ESCURECE UNIFORME, gravado no arquivo e não por CSS. É a mesma regra das
 *    fotos da hero: o contraste se resolve na origem.
 *
 *    ⚠ O VÉU É UNIFORME, E NÃO UMA RAMPA LATERAL. Houve uma versão com rampa
 *    forte à esquerda, feita para texto alinhado à esquerda. O conteúdo desta
 *    barra é CENTRALIZADO, então a parte escura tem de estar no meio — e com o
 *    texto podendo ocupar qualquer largura, uniforme é o único que não deixa
 *    buraco. As janelas acesas chegam perto de L=0,8 e o bone precisa de fundo
 *    com L<=0,161 para os 4,5:1.
 *
 * ⚠ TROCOU A FOTO, RODE DE NOVO E REMEÇA. Os números da rampa valem para ESTA
 *    imagem. Outra foto, outra distribuição de luz, outra rampa.
 */

import sharp from "sharp";
import { PNG } from "pngjs";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const origem = process.argv[2];
if (!origem) {
  console.error("uso: node scripts/trata-foto-cta.mjs <caminho-do-original>");
  process.exit(1);
}

/* ⚠ A FAIXA SUBIU: top 910, e não mais 1350.

   A de 1350 pegava a fachada de janelas acesas — 5,7% da área acima de L=0,5 e
   p99,9 em 0,923 —, e altas-luzes assim obrigam um véu que esmaga o resto da
   foto. A de 910 tem o guindaste, a laje em obra e a torre ao fundo: mesmo
   assunto, canteiro noturno, com 0,2% acima de 0,5 e p99,9 em 0,844. */
const RECORTE = { left: 0, top: 910, width: 3024, height: 889 }; // 3,4:1

/* ⚠ SAÍDA NA LARGURA NATIVA DO RECORTE, 3024. Era 1920, e o resize jogava
   resolução fora: a faixa é servida com sizes="100vw", então a 1440px em DPR 2
   o navegador pede 2880 e recebia 1920 — ampliação de 1,5x, medida, e é dela
   que vinha o aspecto de borrão. Com 3024 o pedido de 2880 é atendido sem
   esticar. */
const LARGURA = 3024;

/* Alfa do véu preto sobre a foto inteira.

   ⚠ 0,64, E NÃO MAIS 0,74. O valor antigo era do recorte antigo. A conta: o
   bone #FAF8F2 precisa de fundo com L <= 0,1611 para os 4,5:1, e o véu
   escurece por (1-a)^2,4; com o pixel mais claro da faixa em L=1,0 — uma
   lâmpada estourada — o cálculo dá 0,533. Só que o arquivo CODIFICADO devolve
   mais do que o cálculo: com 0,54 o jpeg decodificado sobe a 0,223 (3,48:1) e
   com 0,62 o webp ainda fica em 4,43:1. Em 0,64 os dois fecham: zero pixels
   acima de 0,1611, e o pior pixel dá 5,16:1 no jpg e 4,97:1 no webp.

   ⚠ Trocou a foto ou o recorte, remeça. Este número é desta faixa. */
const VEU = 0.64;

const base = sharp(origem).extract(RECORTE).resize(LARGURA);
const { width, height } = await base.clone().toBuffer({ resolveWithObject: true })
  .then((r) => r.info);

/* O véu é gerado pixel a pixel: um gradiente CSS não serve porque ele tem de
   ficar DENTRO do arquivo. */
const veu = new PNG({ width, height });
const a = Math.round(VEU * 255);
for (let i = 0; i < veu.data.length; i += 4) {
  veu.data[i] = 0;
  veu.data[i + 1] = 0;
  veu.data[i + 2] = 0;
  veu.data[i + 3] = a;
}

const tratada = base.composite([{ input: PNG.sync.write(veu), blend: "over" }]);
const saida = path.join(raiz, "public/cta");
fs.mkdirSync(saida, { recursive: true });

await tratada.clone().jpeg({ quality: 72, mozjpeg: true })
  .toFile(path.join(saida, "canteiro-noturno.jpg"));
await tratada.clone().webp({ quality: 70 })
  .toFile(path.join(saida, "canteiro-noturno.webp"));

for (const f of ["canteiro-noturno.jpg", "canteiro-noturno.webp"]) {
  const p = path.join(saida, f);
  const m = await sharp(p).metadata();
  console.log(`${f.padEnd(24)} ${m.width}x${m.height}  ${(fs.statSync(p).size / 1024).toFixed(0)} KB`);
}
