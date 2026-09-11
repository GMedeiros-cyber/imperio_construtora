/**
 * Gera /public/hero/hero-wide.{jpg,webp} e hero-tall.{jpg,webp} a partir do
 * original.
 *
 *   node scripts/trata-foto-hero.mjs <caminho-do-original> [veu-uniforme]
 *
 * O original é a foto de 7952x5304 (Retrato Inmobiliario / Unsplash), fora do
 * repositório — hoje em C:/Users/gabri/OneDrive/Desktop/imperio-originais/.
 * Ele NÃO é versionado: 7,5 MB de origem não têm por que entrar no deploy.
 *
 * ══ POR QUE ESTE SCRIPT EXISTE ══
 *
 * As duas fotos da hero sempre tiveram tratamento GRAVADO NO ARQUIVO — o
 * cabeçalho do components/hero.tsx manda que seja assim, e proíbe gradiente,
 * overlay ou filter por CSS. Só que o tratamento tinha sido feito à mão e não
 * havia script: dava para medir o resultado, não para refazê-lo. Agora dá.
 *
 * ══ O QUE O SCRIPT FAZ ══
 *
 * 1. RECORTA os dois enquadramentos. Os números saíram de um alinhamento
 *    medido entre o original e os arquivos que já estavam no site (o terço de
 *    cima bate com erro de 7 a 9 níveis em 255, que é só recompressão):
 *      hero-wide 16:9  x=0     y=504  7936x4464  ->  1920x1080
 *      hero-tall 4:5   x=1864  y=0    4226x5283  ->  1200x1500
 *
 * 2. REPÕE A RAMPA DA BASE, que é o tratamento que já existia. Medida contra o
 *    original, linha a linha, em espaço de alfa:
 *      wide  alfa(y) = 0,64 * ((y-0,44)/0,56)^1,2   (rms 0,023)
 *      tall  alfa(y) = 0,66 * ((y-0,41)/0,59)^1,2   (rms 0,017)
 *    É ela que dá contraste ao texto que se apoia na base.
 *
 * 3. SOMA UM VÉU UNIFORME sobre a foto inteira — o acréscimo desta rodada.
 *
 *    ⚠ UNIFORME, E NÃO RAMPA NOVA NEM FAIXA LOCALIZADA. O problema medido não
 *    estava na base: estava na PAREDE CLARA da garagem, no meio da foto, onde
 *    a rampa não chega. Lá o bone da manchete dava 2,89:1 a 1440px (mínimo
 *    3:1) e a varredura dourada do DiaText passava por 1,01:1 — claro sobre
 *    claro. Rampa não resolve meio de foto; véu uniforme resolve, e de quebra
 *    sobe o número da base junto.
 *
 * ⚠ TROCOU A FOTO, RODE DE NOVO E REMEÇA TUDO. Estes números são desta imagem:
 *    o recorte, a rampa e o véu. O que se mede está registrado nos Desvios do
 *    DESIGN.md, seção da hero.
 */

import sharp from "sharp";
import { PNG } from "pngjs";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const origem = process.argv[2];
if (!origem) {
  console.error("uso: node scripts/trata-foto-hero.mjs <caminho-do-original> [veu-uniforme]");
  process.exit(1);
}

/* Alfa do véu preto aplicado sobre a foto INTEIRA, por cima da rampa da base.
   O valor é o menor que fecha as duas condições medidas no navegador, nas 7
   larguras, sem a foto deixar de ler como fotografia — ver os Desvios. */
const VEU_UNIFORME = Number(process.argv[3] ?? 0.16);

const CORTES = [
  {
    saida: "hero-wide",
    extrair: { left: 0, top: 504, width: 7936, height: 4464 },
    largura: 1920,
    altura: 1080,
    rampa: { inicio: 0.44, alfa: 0.64, curva: 1.2 },
  },
  {
    saida: "hero-tall",
    extrair: { left: 1864, top: 0, width: 4226, height: 5283 },
    largura: 1200,
    altura: 1500,
    rampa: { inicio: 0.41, alfa: 0.66, curva: 1.2 },
  },
];

const destino = path.join(raiz, "public/hero");
fs.mkdirSync(destino, { recursive: true });

for (const corte of CORTES) {
  const base = sharp(origem)
    .extract(corte.extrair)
    .resize(corte.largura, corte.altura, { fit: "fill" });

  /* O véu é gerado pixel a pixel: precisa ficar DENTRO do arquivo, e um
     gradiente de CSS não serviria. Alfa por linha = rampa da base + uniforme,
     com teto em 1. */
  const veu = new PNG({ width: corte.largura, height: corte.altura });
  for (let y = 0; y < corte.altura; y++) {
    const t = Math.max(0, (y / (corte.altura - 1) - corte.rampa.inicio) / (1 - corte.rampa.inicio));
    const a = Math.min(1, VEU_UNIFORME + corte.rampa.alfa * Math.pow(t, corte.rampa.curva));
    const byte = Math.round(a * 255);
    for (let x = 0; x < corte.largura; x++) {
      const i = (y * corte.largura + x) * 4;
      veu.data[i] = 0;
      veu.data[i + 1] = 0;
      veu.data[i + 2] = 0;
      veu.data[i + 3] = byte;
    }
  }

  const tratada = base.composite([{ input: PNG.sync.write(veu), blend: "over" }]);
  await tratada.clone().jpeg({ quality: 80, mozjpeg: true }).toFile(path.join(destino, `${corte.saida}.jpg`));
  await tratada.clone().webp({ quality: 78 }).toFile(path.join(destino, `${corte.saida}.webp`));
}

console.log(`véu uniforme ${VEU_UNIFORME} sobre a rampa da base`);
for (const f of ["hero-wide.jpg", "hero-wide.webp", "hero-tall.jpg", "hero-tall.webp"]) {
  const p = path.join(destino, f);
  const m = await sharp(p).metadata();
  console.log(`  ${f.padEnd(16)} ${m.width}x${m.height}  ${(fs.statSync(p).size / 1024).toFixed(0)} KB`);
}
