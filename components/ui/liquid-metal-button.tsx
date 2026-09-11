"use client";

import { liquidMetalFragmentShader, ShaderMount } from "@paper-design/shaders";
import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";

/*
 * Adaptado do componente original para este projeto:
 *
 * - TODOS os box-shadow foram removidos. Eram cinco camadas empilhadas; a
 *   regra de zero sombra vale para a página inteira, sem exceção.
 * - O texto estava fixo em #666666: agora é bone (#FAF8F2), e o text-shadow
 *   saiu junto com as sombras.
 * - O shader foi tingido de dourado por u_colorTint, que o componente original
 *   nem passava. Sem ele o uniform fica zerado, u_colorTint.a = 0 e a tintura
 *   é desligada no GLSL — daí o anel prateado. u_softness e u_repetition
 *   também foram ajustados para um brilho mais contínuo, menos listrado.
 * - As dimensões eram fixas em 142x46 e agora são props.
 * - Aceita href: quando presente vira <a>, que é o certo para um destino de
 *   âncora. Sem href continua <button>.
 * - O ripple do clique foi mantido, mas usa bone em vez de branco puro.
 * - O contêiner do shader era preenchido de #B79653. Virou borda de 1px na
 *   mesma cor: o preenchimento sólido piscava como pílula amarela cheia a cada
 *   recarregamento, porque o shader só monta depois da hidratação.
 */

/*
 * A paleta do shader e FIXA no GLSL: color1 = vec3(.98,.98,1.) e
 * color2 = vec3(.1,.1,.1), ou seja, branco contra cinza — e por isso ele nasce
 * prateado. Quem tinge e u_colorTint, aplicado por color burn canal a canal:
 *
 *   ch = mix(ch, 1. - min(1., (1. - ch) / max(tint, .0001)), u_colorTint.a)
 *
 * Sem u_colorTint o uniform fica zerado, u_colorTint.a = 0 e a tintura inteira
 * e desligada. Era esse o motivo do anel prateado.
 *
 * u_shiftRed e u_shiftBlue NAO tingem: deslocam a fase das listras de R e de B
 * (aberracao cromatica nas bordas da listra) e ainda sao divididos por 20 no
 * shader. Servem para a franja, nao para a cor de base.
 */
const UNIFORMS_OURO = {
  u_repetition: 3,
  u_softness: 0.72,
  /* Ambar da marca. Nao e o #B79653 literal: o color burn e multiplicativo,
     entao um tint mais saturado que o alvo e o que faz o anel MEDIR como
     #B79653. Com o #B79653 cru o anel dava R-B=45; com este, R-B=85, contra
     os 100 do dourado chapado. Medido no anel visivel, media de 5 quadros. */
  u_colorTint: [0.75, 0.52, 0.12, 1],
  u_colorBack: [0, 0, 0, 0],
  /* Franja cromatica. Medido: no anel de 1px estes dois praticamente nao
     mudam nada — R-B vai de 82 a 85 em toda a faixa legal, e da 82 ate com
     ambos em zero. Ficam no valor mais quente por margem, nao por efeito. */
  u_shiftRed: 0.72,
  u_shiftBlue: 0.04,
  u_distortion: 0,
  u_contour: 0,
  u_angle: 45,
  u_scale: 8,
  u_shape: 1,
  u_offsetX: 0.1,
  u_offsetY: -0.1,
};

/* Anel de foco do alvo: o mesmo gold-lt com folga de 2px do estado estático
   (components/ui/botao-contato.tsx), para o foco não mudar quando o shader
   entra. */
const FOCO =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-lt";

interface LiquidMetalButtonProps {
  label?: string;
  href?: string;
  onClick?: () => void;
  width?: number;
  height?: number;
  /** Corpo do rótulo em px. 14 é o do desktop; o celular usa 12. */
  tamanhoRotulo?: number;
  className?: string;
}

export function LiquidMetalButton({
  label = "Falar com a Império",
  href,
  onClick,
  width = 232,
  height = 56,
  tamanhoRotulo = 14,
  className,
}: LiquidMetalButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [ripples, setRipples] = useState<
    Array<{ x: number; y: number; id: number }>
  >([]);
  const shaderRef = useRef<HTMLDivElement>(null);
  const shaderMount = useRef<ShaderMount | null>(null);
  const alvoRef = useRef<HTMLElement>(null);
  const rippleId = useRef(0);

  const dimensions = useMemo(
    () => ({ width, height, innerWidth: width - 4, innerHeight: height - 4 }),
    [height, width],
  );

  useEffect(() => {
    const styleId = "shader-canvas-style-imperio";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        .shader-container-imperio canvas {
          width: 100% !important;
          height: 100% !important;
          display: block !important;
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          border-radius: 1440px !important;
        }
        @keyframes ripple-imperio {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 0.5; }
          100% { transform: translate(-50%, -50%) scale(4); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }

    const alvo = shaderRef.current;
    if (!alvo) return;

    /* O shader sobe fora do caminho crítico: a foto da hero é o LCP e não
       pode esperar a compilação do WebGL. */
    const ocioso =
      typeof window.requestIdleCallback === "function"
        ? window.requestIdleCallback
        : (cb: () => void) => window.setTimeout(cb, 200);

    let cancelado = false;
    const id = ocioso(() => {
      if (cancelado) return;
      try {
        shaderMount.current = new ShaderMount(
          alvo,
          liquidMetalFragmentShader,
          { ...UNIFORMS_OURO },
          undefined,
          0.6,
        );
      } catch (erro) {
        /* Sem WebGL sobram a borda dourada e o miolo escuro, que já são
           o estado de repouso do botão. */
        console.error("shader do botão não montou:", erro);
      }
    });

    return () => {
      cancelado = true;
      if (typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(id as number);
      }
      shaderMount.current?.dispose?.();
      shaderMount.current = null;
    };
  }, []);

  const aoEntrar = () => {
    setIsHovered(true);
    shaderMount.current?.setSpeed?.(1);
  };

  const aoSair = () => {
    setIsHovered(false);
    shaderMount.current?.setSpeed?.(0.6);
  };

  const aoClicar = (e: React.MouseEvent<HTMLElement>) => {
    shaderMount.current?.setSpeed?.(2.4);
    window.setTimeout(() => {
      shaderMount.current?.setSpeed?.(isHovered ? 1 : 0.6);
    }, 300);

    if (alvoRef.current) {
      const rect = alvoRef.current.getBoundingClientRect();
      const ripple = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        id: rippleId.current++,
      };
      setRipples((prev) => [...prev, ripple]);
      window.setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== ripple.id));
      }, 600);
    }

    onClick?.();
  };

  const conteudoInterativo = (
    <>
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          style={{
            position: "absolute",
            left: `${ripple.x}px`,
            top: `${ripple.y}px`,
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(250, 248, 242, 0.35) 0%, rgba(250, 248, 242, 0) 70%)",
            pointerEvents: "none",
            animation: "ripple-imperio 0.6s ease-out",
          }}
        />
      ))}
    </>
  );

  const estiloInterativo: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    width: `${dimensions.width}px`,
    height: `${dimensions.height}px`,
    background: "transparent",
    border: "none",
    cursor: "pointer",
    /* SEM outline: "none" aqui. Ele sumia com o anel de foco do teclado — o
       alvo é o único elemento focável do botão, e sem anel quem navega por
       Tab não via onde estava. O anel vem da classe FOCO. */
    zIndex: 40,
    overflow: "hidden",
    borderRadius: "1440px",
  };

  return (
    <div
      className={className}
      style={{
        position: "relative",
        display: "inline-block",
        width: `${dimensions.width}px`,
        height: `${dimensions.height}px`,
      }}
    >
      {/* Rótulo, acima de tudo */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 30,
          pointerEvents: "none",
        }}
      >
        <span
          style={{
            fontSize: `${tamanhoRotulo}px`,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#FAF8F2",
            fontWeight: 400,
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </span>
      </div>

      {/* Miolo escuro, para o rótulo bone ter contraste sobre o shader */}
      <div
        style={{
          position: "absolute",
          top: 2,
          left: 2,
          width: `${dimensions.innerWidth}px`,
          height: `${dimensions.innerHeight}px`,
          borderRadius: "1440px",
          background: "linear-gradient(180deg, #1a1a1a 0%, #0A0A0A 100%)",
          zIndex: 20,
        }}
      />

      {/* Canvas do shader, na base da pilha */}
      <div
        ref={shaderRef}
        className="shader-container-imperio"
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "1440px",
          overflow: "hidden",
          /* O dourado vem da BORDA, não de preenchimento. Era
             background:"#B79653": uma pílula amarela cheia que aparecia a cada
             recarregamento, no intervalo entre a hidratação e a montagem do
             shader. Com a borda, o estado anterior à montagem já é o estado
             final e não existe flash nenhum. */
          background: "transparent",
          border: "1px solid #B79653",
          zIndex: 10,
        }}
      />

      {href ? (
        <a
          ref={alvoRef as React.RefObject<HTMLAnchorElement>}
          href={href}
          aria-label={label}
          onClick={aoClicar}
          onMouseEnter={aoEntrar}
          onMouseLeave={aoSair}
          style={estiloInterativo}
          className={FOCO}
        >
          {conteudoInterativo}
        </a>
      ) : (
        <button
          ref={alvoRef as React.RefObject<HTMLButtonElement>}
          type="button"
          aria-label={label}
          onClick={aoClicar}
          onMouseEnter={aoEntrar}
          onMouseLeave={aoSair}
          style={estiloInterativo}
          className={FOCO}
        >
          {conteudoInterativo}
        </button>
      )}
    </div>
  );
}

export default LiquidMetalButton;
