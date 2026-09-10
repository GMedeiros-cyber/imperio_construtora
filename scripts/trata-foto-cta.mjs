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

const RECORTE = { left: 0, top: 1350, width: 3024, height: 890 }; // 3,4:1
const LARGURA = 1920;

/* Alfa do véu preto sobre a foto inteira. 0,74 foi o valor em que o pixel mais
   claro da faixa desceu de L=0,80 para dentro do teto de 0,161 que o texto bone
   exige. Mexeu na foto ou no recorte, remeça: este número é desta imagem. */
const VEU = 0.74;

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
