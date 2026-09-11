/**
 * Escurece TODA a mídia da faixa de paralaxe — as três fotos, os dois pôsteres,
 * os dois vídeos e o placeholder — gravando o tratamento NO ARQUIVO.
 *
 *   node scripts/trata-fotos-faixa.mjs [pasta-de-origem] [teto] [gama]
 *   (padrão: C:/Users/gabri/OneDrive/Desktop/imperio-originais/faixa, 72, 0.75)
 *
 * ══ REGRA, E NÃO SUGESTÃO ══
 *
 * ⚠ TODA foto, pôster ou vídeo que for entrar em public/faixa/ passa por aqui
 * ANTES de ser commitado. Mídia sem tratamento devolve a manchete da faixa
 * para dentro da zona de falha do mix-blend-difference, num site que está no
 * ar. O alvo de aceite é ZERO: 0% da área dos glifos da manchete abaixo de
 * 3:1, na pior posição de rolagem, nas sete larguras de verificação. "Caiu de
 * 35% para 8%" é reprovado. Ver o Desvio 9 do DESIGN.md e a seção de mídia da
 * faixa no AGENTS.md.
 *
 * ══ DE ONDE ELE LÊ ══
 *
 * Da pasta de ORIGINAIS, fora do repositório:
 * C:/Users/gabri/OneDrive/Desktop/imperio-originais/faixa. É de propósito: se
 * lesse de public/faixa/, cada execução escureceria o arquivo já escuro e o
 * resultado não voltaria atrás. O que está lá hoje é a cópia do que estava
 * versionado ANTES do tratamento — estas mídias não têm original de verdade
 * (as fotos vieram de dentro de um PDF, os vídeos são WhatsApp a 480p).
 *
 * ⚠ QUANDO CHEGAR MÍDIA BOA, ponha o arquivo bruto naquela pasta e rode o
 * script a partir dele. NUNCA re-trate o que já está em public/faixa/: os dois
 * mp4 de hoje já carregam duas gerações de perda (compressão do WhatsApp mais
 * esta recodificação), e uma terceira não se desfaz.
 *
 * ══ ffmpeg NÃO É DEPENDÊNCIA DO PROJETO ══
 *
 * Ele não está no package.json e não precisa estar: só os vídeos passam por
 * ele. Quem for tratar vídeo aponta o binário —
 *
 *   FFMPEG=<caminho do ffmpeg> node scripts/trata-fotos-faixa.mjs
 *
 * — ou deixa um `ffmpeg` no PATH. Sem isso o script trata as imagens, avisa e
 * sai com erro, em vez de deixar vídeo claro passando por trás do texto.
 *
 * ══ POR QUE ESTE SCRIPT EXISTE ══
 *
 * A manchete da faixa lê por mix-blend-difference: o texto composto vale
 * |bone - fundo|. Contra fundo escuro ele é quase branco (17:1 medido sobre o
 * ink) e contra fundo claro fica quase preto (20:1) — mas contra MEIO-TOM as
 * duas cores convergem e o texto some. Medido no cinza, com bone #FAF8F2:
 *
 *   contraste < 3:1 para todo fundo com canal entre 85 e 163
 *
 * A manchete é sticky e a mídia atravessa a tela inteira, então cada pixel de
 * cada mídia passa atrás dos glifos em algum ponto da rolagem. Com a faixa em
 * duas colunas largas no mobile, isso deixou de ser raridade: medido, até
 * 35,4% da área dos glifos abaixo de 3:1 a 390px e 42,1% a 767px, e 12,3% a
 * 1440px — este último já estava no ar antes desta rodada.
 *
 * ══ O QUE O SCRIPT FAZ ══
 *
 * Uma curva de tom, por canal, UNIFORME sobre a imagem inteira:
 *
 *   saida = TETO * (entrada / 255) ^ GAMA
 *
 * O limite é 84: com todo canal em 84 ou menos, o texto composto fica em 166 ou
 * mais e o par mede 3,2:1 — passa em texto grande, e passa em QUALQUER pixel,
 * não em média. TETO = 72, e não 84, porque a compressão com perda ESTOURA o
 * teto: medido, o jpeg e o webp devolvem até 95 de luminância onde o pixel
 * gravado era 84, e o h264 a crf 26 devolve até 109. Com 72 e as qualidades
 * abaixo (jpeg 88 sem subamostragem de croma, webp 88, h264 crf 20), o pixel
 * DECODIFICADO não passa de 0,087 de luminância, contra o limite de 0,0887 —
 * zero pixels acima, medido nos cinco arquivos e em oito quadros de cada
 * vídeo.
 *
 * GAMA = 0,75 levanta sombra e meio-tom DENTRO desse teto. Sem ela (gama 1, o
 * véu multiplicativo puro dos outros dois scripts) a interior-obra, que já é
 * escura, cairia para média 21 de 255 e viraria mancha; com a curva ela fica
 * em 34 e o vão da janela continua lendo.
 *
 * ⚠ UNIFORME, e não rampa. Rampa resolve texto apoiado na base de uma foto
 *   parada, como na hero. Aqui o texto não tem posição fixa em relação à
 *   mídia: ela desliza por baixo dele. Só o tratamento uniforme fecha.
 *
 * ⚠ A ORIGEM É OUTRA PASTA, de propósito. Tratar a partir de public/faixa
 *   escureceria de novo a cada execução. As fontes não tratadas ficam fora do
 *   repositório, junto com o original da hero.
 *
 * ⚠ ESTAS FOTOS NÃO TÊM ORIGINAL. Elas vieram de dentro de um PDF e de
 *   capturas de story, em baixa resolução; o que está na pasta de origem é a
 *   cópia dos arquivos versionados antes deste tratamento. Quando o cliente
 *   mandar os originais, ponha-os lá e rode de novo.
 *
 * ⚠ TROCOU A MÍDIA, RODE DE NOVO E REMEÇA. O alvo é 0% da área dos glifos
 *   abaixo de 3:1 nas sete larguras, medido no navegador — está nos Desvios do
 *   DESIGN.md, seção 9.
 */

import sharp from "sharp";
import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";
import { fileURLToPath } from "url";

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const origem = process.argv[2] ?? "C:/Users/gabri/OneDrive/Desktop/imperio-originais/faixa";
const TETO = Number(process.argv[3] ?? 72);
const GAMA = Number(process.argv[4] ?? 0.75);
const destino = path.join(raiz, "public/faixa");

if (!fs.existsSync(origem)) {
  console.error(`origem não encontrada: ${origem}`);
  process.exit(1);
}

/* A curva, resolvida uma vez em tabela de 256 entradas: é a mesma para os três
   canais, e assim imagem e vídeo aplicam exatamente o mesmo número. */
const CURVA = Array.from({ length: 256 }, (_, v) => Math.round(TETO * Math.pow(v / 255, GAMA)));

const FOTOS = [
  { arquivo: "analia-franco.jpg", webp: true },
  { arquivo: "casa-em-obra.jpg", webp: true },
  { arquivo: "interior-obra.jpg", webp: true },
  /* Os pôsteres são o primeiro quadro do vídeo e ficam à mostra enquanto o
     arquivo não chega — têm de receber o mesmo tratamento. */
  { arquivo: "obra-video-1-poster.jpg", webp: false },
  { arquivo: "obra-video-2-poster.jpg", webp: false },
];

const VIDEOS = ["obra-video-1.mp4", "obra-video-2.mp4"];

/* O placeholder é gráfico, não foto: a chapa graphite é o que passa atrás da
   manchete, e os rótulos em bone continuam bone (escurecê-los só pioraria a
   leitura dentro do próprio cartão). */
const PLACEHOLDER = "placeholder-5.svg";

function aplica(dados, canais) {
  for (let i = 0; i < dados.length; i += canais) {
    dados[i] = CURVA[dados[i]];
    dados[i + 1] = CURVA[dados[i + 1]];
    dados[i + 2] = CURVA[dados[i + 2]];
  }
  return dados;
}

const relatorio = [];

for (const foto of FOTOS) {
  const entrada = path.join(origem, foto.arquivo);
  const { data, info } = await sharp(entrada).raw().toBuffer({ resolveWithObject: true });
  aplica(data, info.channels);
  const bruta = sharp(data, { raw: { width: info.width, height: info.height, channels: info.channels } });
  await bruta
    .clone()
    /* 4:4:4 e qualidade alta não são capricho: é a compressão que estoura o
       teto, e cada nível de estouro é um pixel de meio-tom de volta atrás da
       manchete. Os arquivos ainda saem menores do que os de antes, porque a
       faixa dinâmica agora é um terço da que era. */
    .jpeg({ quality: 88, mozjpeg: true, chromaSubsampling: "4:4:4" })
    .toFile(path.join(destino, foto.arquivo));
  if (foto.webp) {
    await bruta.clone().webp({ quality: 88 }).toFile(path.join(destino, foto.arquivo.replace(/\.jpg$/, ".webp")));
  }
  let max = 0, soma = 0, n = 0;
  for (let i = 0; i < data.length; i += info.channels) {
    max = Math.max(max, data[i], data[i + 1], data[i + 2]);
    soma += Math.max(data[i], data[i + 1], data[i + 2]);
    n++;
  }
  relatorio.push({ arquivo: foto.arquivo, px: `${info.width}x${info.height}`, maxCanal: max, medio: Math.round(soma / n) });
}

/* Placeholder: a curva vai em TODAS as cores, não só na chapa.
   Os rótulos em bone eram o único ponto claro dentro da mídia, e toda borda
   entre claro e escuro ATRAVESSA a faixa de falha no antialias — medido, 0,05%
   da área dos glifos da manchete a 1440px vinham exatamente daí. Com tudo
   abaixo do teto, o degrau some. O preço é que "FOTO PENDENTE" e o "05" ficam
   fracos dentro do cartão; é marcação de trabalho, some quando a foto chegar. */
const svg = fs.readFileSync(path.join(origem, PLACEHOLDER), "utf8");
const trocas = [];
const svgTratado = svg.replace(/fill="#([0-9A-Fa-f]{6})"/g, (_, hex) => {
  const novo = hex
    .match(/../g)
    .map((h) => CURVA[parseInt(h, 16)].toString(16).padStart(2, "0").toUpperCase())
    .join("");
  trocas.push(`#${hex}->#${novo}`);
  return `fill="#${novo}"`;
});
fs.writeFileSync(path.join(destino, PLACEHOLDER), svgTratado);
relatorio.push({ arquivo: PLACEHOLDER, px: "213x266", chapa: trocas.join(" ") });

/* ── Vídeos ──────────────────────────────────────────────────────────────
   lutrgb com a MESMA curva das fotos. -an porque os arquivos da faixa não têm
   trilha de áudio e não é aqui que ela vai nascer; +faststart porque o vídeo é
   pedido sob demanda, quando a seção se aproxima. */
const ffmpeg = process.env.FFMPEG ?? "ffmpeg";
let temFfmpeg = true;
try {
  execFileSync(ffmpeg, ["-version"], { stdio: "ignore" });
} catch {
  temFfmpeg = false;
}

if (temFfmpeg) {
  const expr = (c) => `${c}='${TETO}*pow(val/255,${GAMA})'`;
  for (const video of VIDEOS) {
    execFileSync(
      ffmpeg,
      [
        "-y", "-i", path.join(origem, video),
        "-vf", `format=rgb24,lutrgb=${expr("r")}:${expr("g")}:${expr("b")},format=yuv420p`,
        "-c:v", "libx264", "-crf", "20", "-preset", "slow", "-profile:v", "high",
        "-movflags", "+faststart", "-an",
        path.join(destino, video),
      ],
      { stdio: "ignore" },
    );
    relatorio.push({ arquivo: video, bytes: fs.statSync(path.join(destino, video)).size });
  }
} else {
  console.error(`\n⚠ ffmpeg não encontrado (FFMPEG=${ffmpeg}). Os vídeos NÃO foram tratados.`);
}

console.log(`curva: saida = ${TETO} * (entrada/255)^${GAMA}   (origem: ${origem})`);
for (const r of relatorio) {
  const p = path.join(destino, r.arquivo);
  console.log(
    `  ${r.arquivo.padEnd(24)} ${(r.px ?? "").padEnd(10)} ${(fs.statSync(p).size / 1024).toFixed(0).padStart(5)} KB` +
      (r.maxCanal !== undefined ? `  maxCanal ${r.maxCanal}  médio ${r.medio}` : "") +
      (r.chapa ? `  ${r.chapa}` : ""),
  );
}
if (!temFfmpeg) process.exit(2);
