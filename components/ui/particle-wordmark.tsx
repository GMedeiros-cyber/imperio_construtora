"use client";

import type { CSSProperties } from "react";

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
 * nosso canvas é um só, o bone) e os controles de hue/saturation/brightness,
 * que existiam para a galeria de demonstração.
 *
 * ══ A PALETA ══
 *
 * O original vinha em brancos e azulados, para fundo escuro. Aqui é dourado
 * sobre creme, e a matemática do contraste fecha a escolha:
 *
 *   gold    #B79653 opaco sobre bone = 2,64:1  -> NUNCA alcança 3:1
 *   gold-lt #D4B872 é mais claro ainda        -> pior
 *   gold-dk #8A6D2F opaco sobre bone = 4,59:1 -> passa, e é o único que passa
 *
 * Não é questão de dosar: partícula é sempre composta com alfa sobre o fundo,
 * e compor só CLAREIA. Se o tom opaco já reprova, nenhuma alfa salva. Por isso
 * a paleta não tem gold nem gold-lt — os dois degraus são gold-dk e um gold
 * mais fechado, para sobrar variação tonal sem sair da faixa aprovada.
 *
 * Pelo mesmo motivo o piso de alfa é alto: gold-dk só cruza os 3:1 a partir de
 * alfa 0,77 (medido: 0,80 dá 3,19:1 e 1,00 dá 4,59:1). O efeito de nevasca do
 * original vivia de partícula quase transparente, e sobre creme isso é o mesmo
 * que apagar a palavra.
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

/* A razão do quadro, e a mesma do viewBox do SVG abaixo.
   ⚠ ERA 16/3, COM O viewBox EM 1600. Medido no render, a palavra ocupava só
   66% da largura: sobrava margem morta dos dois lados e a assinatura chegava
   miúda no fim da página. O viewBox apertou para 1140, encostando na palavra,
   e a razão veio junto — como a largura é dada pelo layout, quadro mais
   estreito significa quadro mais ALTO, e a palavra cresce na mesma proporção.

   Mexeu num, mexa no outro: se os dois discordarem, a máscara deforma. */
export const PROPORCAO_ASSINATURA = 1140 / 300;

const PALAVRA_SVG = `<svg width="1140" height="300" viewBox="0 0 1140 300" fill="none" xmlns="http://www.w3.org/2000/svg">
  <text x="570" y="232" text-anchor="middle" fill="#FFFFFF" font-family="Zodiak, Georgia, 'Times New Roman', serif" font-size="252" font-weight="300" letter-spacing="-6">IMPÉRIO</text>
</svg>`;

/* ⚠ AGORA E O GOLD CHEIO #B79653, e nao mais o gold-dk. O rodape virou ink, e
   a conta se inverteu: sobre o creme so o gold-dk passava (4,59:1 contra 2,64:1
   do gold); sobre o ink o gold cheio mede 7,07:1 e e ele que faz a palavra
   brilhar. O terceiro tom e o gold-lt #D4B872, para os graos mais quentes
   pegarem luz na borda. */
const PALETA = "[[183, 150, 83], [183, 150, 83], [212, 184, 114]]";

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
  var PALETTE = ${PALETA};
  var FORMATS = ["dot", "dot", "square"];
  /* Pontos maiores que os do original: com 1,4px o desenho é quase só borda
     antialiasada, e cada pixel de borda é uma composição parcial que clareia.
     A partir de ~2,4px o ponto passa a ter miolo cheio, que é onde o gold-dk
     aparece no seu tom, e não numa diluição dele. */
  var SIZE_SMALL = [2.4, 3.8];
  var SIZE_BIG = [4.2, 5.6];
  var BIG_CHANCE = 0.07;
  /* Passo da grade. Fixo em 6px como no original a palavra se desmancha no
     celular: em 358px de largura sobram ~8 partículas por letra e o desenho
     deixa de ser legível. Passa a acompanhar a largura, entre 3 e 6px. */
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

  function squall(p, t) {
    var band = 0.35 + 0.65 * Math.pow(0.5 + 0.5 * Math.sin(3 * p.nx - 0.5 * t), 2);
    var flake = snowfall(p, t, { fall: 0.26, freq: 5, trail: 0.4, sway: 0.14, wind: 0.8 });
    /* Piso em 0,80, e não nos 0,04 do original: gold-dk sobre bone só cruza
       os 3:1 a partir de alfa 0,77. A animação vive na faixa 0,80-1,00, que
       dá cintilância sem derrubar o contraste. */
    return { a: 0.80 + 0.20 * band * Math.pow(flake, 1.8), p: 0.7 * p.offset };
  }

  function lerpRGB(a, b, t) {
    return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  }

  function mixPalette(p) {
    var e = Math.max(0, Math.min(1, p)) * (PALETTE.length - 1);
    var r = Math.floor(e);
    return lerpRGB(PALETTE[r], PALETTE[Math.min(PALETTE.length - 1, r + 1)], e - r);
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
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.floor(w * dpr));
    canvas.height = Math.max(1, Math.floor(h * dpr));
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    var sample = makeMask(w, h);
    var rand = lcg(SEED);
    var GAP = gapDe(w);
    var cols = Math.ceil(w / GAP), rows = Math.ceil(h / GAP);
    var ox = (w - (cols - 1) * GAP) / 2, oy = (h - (rows - 1) * GAP) / 2;
    var cx = (cols - 1) / 2, cy = (rows - 1) / 2;
    var maxd = Math.hypot(cx, cy) || 1;
    particles = [];
    for (var y = 0; y < rows; y++) {
      for (var x = 0; x < cols; x++) {
        var range = rand() < BIG_CHANCE ? SIZE_BIG : SIZE_SMALL;
        var px = ox + x * GAP, py = oy + y * GAP;
        particles.push({
          cx: px, cy: py,
          nx: cols > 1 ? x / (cols - 1) : 0.5,
          ny: rows > 1 ? y / (rows - 1) : 0.5,
          dist: Math.hypot(x - cx, y - cy) / maxd,
          format: FORMATS[Math.floor(rand() * FORMATS.length)],
          size: range[0] + rand() * (range[1] - range[0]),
          phase: rand() * TAU,
          speed: 0.6 + 2.6 * rand(),
          offset: rand(),
          mask: sample ? sample(px, py) : 0
        });
      }
    }
  }

  function drawParticle(p, t) {
    /* Fora da palavra não se desenha nada: no original a partícula sem
       máscara ficava visível e enchia o quadro de ruído. Sobre o creme isso
       viraria uma poeira dourada de ponta a ponta do rodapé. */
    if (p.mask <= 0.02) return;
    var field = squall(p, t);
    var rgb = mixPalette(field.p);
    var alpha = Math.max(0, Math.min(1, field.a)) * p.mask;
    if (alpha <= 0.005) return;
    ctx.fillStyle = "rgba(" + Math.round(rgb[0]) + "," + Math.round(rgb[1]) + "," + Math.round(rgb[2]) + "," + alpha + ")";
    var r = p.size / 2;
    if (p.format === "square") ctx.fillRect(p.cx - r, p.cy - r, p.size, p.size);
    else { ctx.beginPath(); ctx.arc(p.cx, p.cy, r, 0, TAU); ctx.fill(); }
  }

  function render(t) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < particles.length; i++) drawParticle(particles[i], t);
  }

  function apply(t) { tNow = ((t % DUR) + DUR) % DUR; render(tNow * SPEED); }

  function tick(now) {
    if (playing && visible) { tNow = ((now - t0) / 1000) % DUR; render(tNow * SPEED); }
    raf = requestAnimationFrame(tick);
  }

  var img = new Image();
  img.onload = function () { maskImg = img; maskReady = true; rebuild(); apply(tNow); };
  img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(WORDMARK);

  rebuild();
  apply(0);
  raf = requestAnimationFrame(tick);

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

  /* Fora da tela o rAF continua sendo agendado, mas não desenha nada. */
  if (typeof IntersectionObserver !== "undefined") {
    new IntersectionObserver(function (entries) {
      var on = entries[0] && entries[0].isIntersecting;
      if (on === visible) return;
      visible = !!on;
      if (visible) t0 = performance.now() - tNow * 1000;
    }, { rootMargin: "120px" }).observe(canvas);
  }

  document.addEventListener("visibilitychange", function () {
    if (!document.hidden && playing) t0 = performance.now() - tNow * 1000;
  });

  /* Sondas de medição, usadas pela verificação de custo. */
  window.__desenhadas = function () { return particles.filter(function (p) { return p.mask > 0.02; }).length; };
  window.__visivel = function () { return visible; };
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
