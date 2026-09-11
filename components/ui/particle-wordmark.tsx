"use client";

import type { CSSProperties } from "react";

import { SINAL_PRONTA } from "@/components/ui/assinatura-constantes";

/*
 * Assinatura em partículas — adaptado do componente recebido.
 *
 * ══ O QUE FOI RETIRADO, E POR QUÊ ══
 *
 * O original embutia a página INTEIRA do rodapé de outro produto (Epilude) e
 * depois isolava um único elemento dela em tempo de execução: papéis
 * data-threeui-role, um <style> de sobrescrita com dezenas de !important, um
 * script que reordena o DOM e marca todo o resto como inert. Tudo isso existia
 * para esconder um rodapé que aqui não entra. Como escrevemos o documento do
 * iframe, só o motor de partículas ficou — o canvas nasce sozinho no
 * documento, sem nada para esconder.
 *
 * Sumiram junto: os tipos FocusTarget/EffectDefinition, o par light/dark (o
 * nosso canvas é um só, o ink) e os controles de hue/saturation/brightness,
 * que existiam para a galeria de demonstração.
 *
 * ══ NÃO HÁ FORMAÇÃO — E NUNCA HOUVE ══
 *
 * A palavra sai inteira no primeiro quadro. MEDIDO (Playwright, print do
 * iframe a partir do instante em que ele entra no DOM): a 390px o primeiro
 * quadro tem 87.279 pixels acesos e o regime tem 87.2k; a 1440px, 37.711
 * contra 37.6k. Não existe código de convergência, de dispersão nem de
 * escalonamento por distância — nunca existiu. O que se move é a NEVASCA: uma
 * banda de brilho que atravessa a palavra pronta. A ENTRADA (surgir conforme
 * a rolagem) é outra coisa e mora no invólucro, assinatura-particulas.tsx.
 *
 * ══ POR QUE "NÃO ANIMAVA NO CELULAR" ══
 *
 * Nenhum dos quatro suspeitos: o iframe monta (dynamic import ok), tem altura
 * (95/103/109px a 360/390/414), o canvas recebe o DPR (backing store 2× e
 * 3×), o IntersectionObserver interno reporta visível e o relógio avança
 * 1,017s por segundo. O que morria era a GEOMETRIA: abaixo de 992px o passo da
 * grade cai para 3px, mas o tamanho da partícula (2,4–5,6px) não acompanhava,
 * e 69% dos pares vizinhos se SOBREPUNHAM (0% a 1440, onde o passo é 6px). A
 * palavra virava uma chapa contínua, e o cintilar de um ponto sumia debaixo do
 * vizinho. Somado ao piso de alfa 0,80 herdado do fundo creme, a amplitude
 * temporal por pixel era de ~11/255 em TODAS as larguras — fraca no desktop,
 * invisível na chapa do celular. Daí: o tamanho passou a escalar com o passo
 * (sobreposição zero em toda largura) e a nevasca ganhou amplitude real.
 *
 * ══ A PALETA, SOBRE O INK ══
 *
 * O rodapé é ink #0A0A0A, e ali o dourado da marca é o gold cheio #B79653
 * (7,07:1 opaco). O gold-dk é o dourado do CREME e não entra aqui.
 *
 * Partícula é composta com alfa sobre o fundo, e sobre o ink compor ESCURECE:
 * o repouso de cada ponto é gold a alfa PISO, escolhido para o miolo do ponto
 * ficar acima dos 3:1 de elemento gráfico com folga (o limiar exato do gold
 * sobre ink é alfa ~0,58). O movimento não desce desse piso: ele SOBE, levando
 * o ponto a alfa 1 e ao gold-lt #D4B872 quando a nevasca passa por ele.
 *
 * Todo ponto desenhado é desenhado INTEIRO: a máscara decide se o ponto existe
 * (limiar 0,5), e não quanto ele vale. Multiplicar o alfa pela máscara, como o
 * original fazia, punha pontos de borda a alfa 0,1 — abaixo de qualquer
 * critério, e sem função: a borda da palavra é dada pela grade, não pelo tom.
 *
 * ══ A FONTE DA MÁSCARA ══
 *
 * A palavra vira uma máscara de luminância: o SVG é carregado como <img> por
 * data: URL, e imagem SVG NÃO resolve webfont — o Zodiak da Fontshare não
 * chega lá dentro. A pilha declara Zodiak primeiro e cai em Georgia, que é a
 * mesma serifada de fallback que o --font-zodiak usa no site. Converter os
 * glifos em path resolveria, mas seria redistribuir a fonte, o que a licença
 * ITF não permite. Com GAP de 6px entre partículas, a diferença entre as duas
 * serifadas se perde na amostragem.
 */

/* Ink #0A0A0A — o mesmo canvas do rodapé, que ficou escuro. */
const FUNDO = "#0A0A0A";

/* ⚠ O viewBox de 1140×300 abaixo É a PROPORCAO_ASSINATURA de
   assinatura-constantes.ts. Mexeu num, mexa no outro: se os dois discordarem,
   a máscara deforma. As constantes moram lá, e não aqui, para este módulo não
   ser importado estaticamente por ninguém — ver o cabeçalho daquele arquivo. */
const PALAVRA_SVG = `<svg width="1140" height="300" viewBox="0 0 1140 300" fill="none" xmlns="http://www.w3.org/2000/svg">
  <text x="570" y="232" text-anchor="middle" fill="#FFFFFF" font-family="Zodiak, Georgia, 'Times New Roman', serif" font-size="252" font-weight="300" letter-spacing="-6">IMPÉRIO</text>
</svg>`;

/* O repouso é o gold cheio #B79653; o brilho da nevasca é o gold-lt #D4B872.
   Os dois são dourados de fundo escuro — ver "A PALETA, SOBRE O INK". */
const OURO = "[183, 150, 83]";
const OURO_CLARO = "[212, 184, 114]";

/* Alfa de repouso do ponto. O gold sobre ink cruza os 3:1 em alfa ~0,58;
   0,70 deixa folga. MEDIDO no pixel composto do print, no centro de cada
   ponto desenhado, a 360/390/414/768/1440: mínimo = mediana = 3,94:1, zero
   pontos abaixo de 3:1; pico de ~10:1 quando a nevasca passa (gold-lt, alfa 1). */
const PISO = 0.7;

function documentoDoIframe() {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Assinatura Império</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: 100%; height: 100%; background: ${FUNDO}; overflow: hidden; }
  #palco { position: relative; width: 100%; height: 100%; overflow: hidden; }
  #palco canvas { display: block; width: 100%; height: 100%; }
</style>
</head>
<body>
<div id="palco"><canvas id="tela"></canvas></div>
<script>
(function () {
  var WORDMARK = ${JSON.stringify(PALAVRA_SVG)};
  var OURO = ${OURO};
  var OURO_CLARO = ${OURO_CLARO};
  var PISO = ${PISO};
  var FORMATS = ["dot", "dot", "square"];
  /* Tamanhos para o passo de REFERÊNCIA de 6px. Com 1,4px (o original) o
     ponto é quase só borda antialiasada; a partir de ~2,4px ele tem miolo
     cheio, que é onde o dourado aparece no seu tom. */
  var GAP_REF = 6;
  var SIZE_SMALL = [2.4, 3.8];
  var SIZE_BIG = [4.2, 5.6];
  var BIG_CHANCE = 0.07;
  /* Piso do diâmetro, em px CSS. Escalando 2,4 por 3/6 o menor ponto cairia a
     1,2px nas larguras de passo 3 (até 768px): numa janela de DPR 1 isso é
     ~1 pixel e o miolo nunca fecha. Com 1,6px o círculo centrado num pixel
     cobre o pixel inteiro (raio 0,8 > meia diagonal 0,71) em qualquer DPR. */
  var SIZE_MIN = 1.6;
  /* Teto do DPR. Era 2 e os celulares de DPR 3 recebiam um canvas de 2×
     esticado em 1,5× — cada ponto virava um borrão de 1,5 pixel de borda.
     A tira tem ~100px de altura: a 3× são 1080×285, custo irrelevante. */
  var DPR_MAX = 3;
  /* Passo da grade. Fixo em 6px como no original a palavra se desmancha no
     celular: em 358px de largura sobram ~8 partículas por letra e o desenho
     deixa de ser legível. Passa a acompanhar a largura, entre 3 e 6px.

     ⚠ O TAMANHO ESCALA JUNTO (fator GAP/GAP_REF). Era fixo, e com passo de
     3px e ponto de até 5,6px os vizinhos se cobriam: 69% dos pares
     sobrepostos a 360–768px, medido. A palavra virava chapa e a nevasca
     sumia. Com o fator, o maior par possível (5,6+5,6)/2 × 3/6 = 2,8 < 3 e
     a sobreposição é zero em toda largura. */
  function gapDe(w) { return Math.max(3, Math.min(6, Math.round(w / 230))); }
  var SPEED = 2;
  var SEED = 1337;
  var GAMMA = 0.8;
  var DUR = 8;
  var TAU = Math.PI * 2;

  function noise(x, y, t) {
    var a = x + 0.7 * Math.sin(1.2 * y + t);
    var r = y + 0.7 * Math.cos(1.1 * x - t);
    return (Math.sin(1.3 * a + 0.6 * t) + Math.cos(1.5 * r - 0.5 * t) + Math.sin((a + r) * 0.9 + 0.3 * t)) / 3;
  }

  function snowfall(p, t, n) {
    var swirl = n.swirl ? n.swirl * noise(3 * p.nx, 3 * p.ny, 0.5 * t) : 0;
    var sway = (n.sway || 0) * Math.sin(0.8 * t + p.offset * TAU + 4 * p.ny) + swirl;
    var i = n.axis === "x" ? p.nx : p.ny;
    var l = n.axis === "x" ? p.ny : p.nx;
    var o = i * n.freq - t * n.fall + p.offset * n.freq + sway + (n.wind || 0) * l;
    var s = o - Math.floor(o);
    return s < n.trail ? 1 - s / n.trail : 0;
  }

  /* ══ O MOVIMENTO ══
     Uma banda lenta (sin em nx) modula uma "queda" de flocos (snowfall). O
     resultado é o BRILHO do ponto, de 0 (repouso) a 1 (floco passando). No
     original o repouso era alfa 0,04 e o floco acendia o ponto — nevasca
     sobre fundo vazio. Aqui a palavra precisa ser legível o tempo todo, então
     o repouso é o PISO e o floco é um destaque por cima dele: alfa sobe até 1
     e a cor caminha do gold para o gold-lt. Nada desce do piso. */
  function squall(p, t) {
    var band = 0.35 + 0.65 * Math.pow(0.5 + 0.5 * Math.sin(3 * p.nx - 0.5 * t), 2);
    var flake = snowfall(p, t, { fall: 0.26, freq: 5, trail: 0.4, sway: 0.14, wind: 0.8 });
    return band * Math.pow(flake, 1.8);
  }

  function lerpRGB(a, b, t) {
    return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  }

  var canvas = document.getElementById("tela");
  var host = document.getElementById("palco");
  var ctx = canvas.getContext("2d");
  var particles = [];
  var maskImg = null;
  var maskReady = false;
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var playing = !reduced;
  var tNow = 0;
  var t0 = performance.now();
  var visible = true;
  var raf = 0;
  var quadros = 0;

  function lcg(seed) {
    var e = seed >>> 0;
    return function () { e = (1664525 * e + 0x3c6ef35f) >>> 0; return e / 0xffffffff; };
  }

  function makeMask(w, h) {
    if (!maskImg || !maskReady || !maskImg.width || !maskImg.height) return null;
    var off = document.createElement("canvas");
    off.width = w; off.height = h;
    var g = off.getContext("2d");
    if (!g) return null;
    var scale = Math.min(w / maskImg.width, h / maskImg.height);
    var dw = maskImg.width * scale, dh = maskImg.height * scale;
    g.drawImage(maskImg, (w - dw) / 2, (h - dh) / 2, dw, dh);
    var data;
    try { data = g.getImageData(0, 0, w, h).data; } catch (e) { return null; }
    return function (x, y) {
      var ix = Math.min(w - 1, Math.max(0, Math.round(x)));
      var iy = Math.min(h - 1, Math.max(0, Math.round(y)));
      var i = (iy * w + ix) * 4;
      var lum = (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255;
      return Math.pow(lum * (data[i + 3] / 255), GAMMA);
    };
  }

  function rebuild() {
    var w = host.clientWidth, h = host.clientHeight;
    if (!w || !h) return;
    var dpr = Math.min(window.devicePixelRatio || 1, DPR_MAX);
    canvas.width = Math.max(1, Math.floor(w * dpr));
    canvas.height = Math.max(1, Math.floor(h * dpr));
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    var sample = makeMask(w, h);
    var rand = lcg(SEED);
    var GAP = gapDe(w);
    var escala = GAP / GAP_REF;
    var cols = Math.ceil(w / GAP), rows = Math.ceil(h / GAP);
    var ox = (w - (cols - 1) * GAP) / 2, oy = (h - (rows - 1) * GAP) / 2;
    var cx = (cols - 1) / 2, cy = (rows - 1) / 2;
    var maxd = Math.hypot(cx, cy) || 1;
    particles = [];
    /* ⚠ ENCAIXE NA GRADE DE PIXELS DO DISPOSITIVO. O passo é em px CSS e o
       deslocamento da grade é fracionário (ox = 1,5 a 360px); a DPR 3 o
       centro caía em 4,5 pixels de dispositivo e o círculo se repartia entre
       quatro pixels, nenhum cheio. O círculo passa a ser centrado no CENTRO
       de um pixel (n + 0,5) e o quadrado a ter borda e lado em pixel inteiro:
       o miolo fecha, e o contraste medido no centro é o da cor, não o de uma
       fatia dela. */
    function centro(v) { return (Math.round(v * dpr - 0.5) + 0.5) / dpr; }
    for (var y = 0; y < rows; y++) {
      for (var x = 0; x < cols; x++) {
        var range = rand() < BIG_CHANCE ? SIZE_BIG : SIZE_SMALL;
        var px = ox + x * GAP, py = oy + y * GAP;
        var format = FORMATS[Math.floor(rand() * FORMATS.length)];
        var size = Math.max(SIZE_MIN, (range[0] + rand() * (range[1] - range[0])) * escala);
        var cxp = centro(px), cyp = centro(py);
        if (format === "square") {
          size = Math.max(1, Math.round(size * dpr)) / dpr;
          cxp = Math.round((px - size / 2) * dpr) / dpr + size / 2;
          cyp = Math.round((py - size / 2) * dpr) / dpr + size / 2;
        }
        particles.push({
          cx: cxp, cy: cyp,
          nx: cols > 1 ? x / (cols - 1) : 0.5,
          ny: rows > 1 ? y / (rows - 1) : 0.5,
          dist: Math.hypot(x - cx, y - cy) / maxd,
          format: format,
          size: size,
          phase: rand() * TAU,
          speed: 0.6 + 2.6 * rand(),
          offset: rand(),
          /* Inteiro ou nada — ver "A PALETA, SOBRE O INK" no cabeçalho. */
          aceso: sample ? sample(px, py) >= 0.5 : false
        });
      }
    }
  }

  function drawParticle(p, t) {
    /* Fora da palavra não se desenha nada: no original a partícula sem
       máscara ficava visível e enchia o quadro de ruído. */
    if (!p.aceso) return;
    var brilho = Math.max(0, Math.min(1, squall(p, t)));
    var rgb = lerpRGB(OURO, OURO_CLARO, brilho);
    var alpha = PISO + (1 - PISO) * brilho;
    ctx.fillStyle = "rgba(" + Math.round(rgb[0]) + "," + Math.round(rgb[1]) + "," + Math.round(rgb[2]) + "," + alpha.toFixed(3) + ")";
    var r = p.size / 2;
    if (p.format === "square") ctx.fillRect(p.cx - r, p.cy - r, p.size, p.size);
    else { ctx.beginPath(); ctx.arc(p.cx, p.cy, r, 0, TAU); ctx.fill(); }
  }

  function render(t) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < particles.length; i++) drawParticle(particles[i], t);
    quadros++;
  }

  function apply(t) { tNow = ((t % DUR) + DUR) % DUR; render(tNow * SPEED); }

  /* ══ O LAÇO PARA DE VERDADE ══
     Antes o rAF continuava agendado fora da tela, só sem desenhar — um
     callback por quadro para nada. Agora o laço só existe enquanto a seção
     está visível, a aba está em primeiro plano e o movimento não é reduzido;
     em qualquer outra condição o quadro pendente é cancelado. O relógio é
     reancorado ao retomar, para a nevasca continuar de onde parou. */
  function tick(now) {
    tNow = ((now - t0) / 1000) % DUR;
    render(tNow * SPEED);
    raf = requestAnimationFrame(tick);
  }
  function sincronizar() {
    var deve = playing && visible && !document.hidden;
    if (deve && !raf) { t0 = performance.now() - tNow * 1000; raf = requestAnimationFrame(tick); }
    else if (!deve && raf) { cancelAnimationFrame(raf); raf = 0; }
  }

  var img = new Image();
  img.onload = function () {
    maskImg = img; maskReady = true; rebuild(); apply(tNow);
    /* Avisa o invólucro de que a palavra está no canvas: é o sinal que libera
       a entrada. Sem allow-same-origin o iframe é origem opaca e o "*" é o
       único alvo possível; a mensagem não carrega nada além de um nome. */
    try { window.parent.postMessage(${JSON.stringify(SINAL_PRONTA)}, "*"); } catch (e) {}
  };
  img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(WORDMARK);

  rebuild();
  apply(0);
  sincronizar();

  window.addEventListener("resize", function () { rebuild(); apply(tNow); });

  if (typeof ResizeObserver !== "undefined") {
    var lastW = host.clientWidth, lastH = host.clientHeight;
    new ResizeObserver(function () {
      if (host.clientWidth !== lastW || host.clientHeight !== lastH) {
        lastW = host.clientWidth; lastH = host.clientHeight;
        rebuild(); apply(tNow);
      }
    }).observe(host);
  }

  if (typeof IntersectionObserver !== "undefined") {
    new IntersectionObserver(function (entries) {
      var on = !!(entries[0] && entries[0].isIntersecting);
      if (on === visible) return;
      visible = on;
      sincronizar();
    }, { rootMargin: "120px" }).observe(canvas);
  }

  document.addEventListener("visibilitychange", sincronizar);

  /* Sondas de medição, usadas pela verificação de custo e de contraste. */
  window.__desenhadas = function () { return particles.filter(function (p) { return p.aceso; }).length; };
  window.__centros = function () {
    return particles.filter(function (p) { return p.aceso; }).map(function (p) { return [p.cx, p.cy, p.size]; });
  };
  window.__visivel = function () { return visible; };
  window.__rodando = function () { return raf !== 0; };
  window.__quadros = function () { return quadros; };
  window.__tempo = function () { return tNow; };
})();
</script>
</body>
</html>`;
}

/* Não depende de prop nenhuma: montado uma vez, no carregamento do módulo. */
const DOCUMENTO = documentoDoIframe();

export type ParticleWordmarkProps = {
  className?: string;
  style?: CSSProperties;
};

/**
 * O iframe é `aria-hidden`: o que ele mostra é uma nuvem de partículas num
 * canvas, invisível para buscador e leitor de tela. Quem carrega o nome como
 * texto é o <span className="sr-only"> que o invólucro põe ao lado.
 *
 * `sandbox="allow-scripts"` sem `allow-same-origin`: o documento roda o
 * script do canvas e não alcança nada desta origem.
 */
export function ParticleWordmark({ className, style }: ParticleWordmarkProps) {
  return (
    <iframe
      aria-hidden="true"
      tabIndex={-1}
      title="Assinatura Império"
      srcDoc={DOCUMENTO}
      sandbox="allow-scripts"
      loading="lazy"
      className={className}
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        border: 0,
        background: FUNDO,
        ...style,
      }}
    />
  );
}

export default ParticleWordmark;
