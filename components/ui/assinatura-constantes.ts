/*
 * O que o invólucro (assinatura-particulas.tsx) e o motor
 * (particle-wordmark.tsx) precisam saber em comum — e NADA mais.
 *
 * ⚠ ESTE ARQUIVO EXISTE POR CAUSA DO BUNDLE. O invólucro carrega o motor
 * por dynamic import com ssr:false para o documento do iframe (HTML + script
 * do canvas, ~8KB gz) ficar fora do carregamento inicial. Mas ele também
 * precisava da proporção do quadro, e a importava ESTATICAMENTE do motor:
 * uma importação estática puxa o módulo inteiro, e o dynamic() virava só um
 * adiamento de render — MEDIDO, o srcDoc estava no chunk referenciado pelo
 * HTML da home. Com as constantes aqui, o motor não é importado
 * estaticamente por ninguém e cai num chunk que só desce quando a seção
 * chega perto.
 *
 * Não importe particle-wordmark.tsx estaticamente de lugar nenhum.
 */

/* A razão do quadro, e a mesma do viewBox do SVG da máscara.
   ⚠ ERA 16/3, COM O viewBox EM 1600. Medido no render, a palavra ocupava só
   66% da largura: sobrava margem morta dos dois lados e a assinatura chegava
   miúda no fim da página. O viewBox apertou para 1140, encostando na palavra,
   e a razão veio junto — como a largura é dada pelo layout, quadro mais
   estreito significa quadro mais ALTO, e a palavra cresce na mesma proporção.

   Mexeu num, mexa no outro: se os dois discordarem, a máscara deforma. */
export const PROPORCAO_ASSINATURA = 1140 / 300;

/* Nome da mensagem que o iframe manda ao pai quando a palavra está desenhada
   no canvas. O invólucro a escuta para só então liberar a entrada. */
export const SINAL_PRONTA = "assinatura-imperio:pronta";
