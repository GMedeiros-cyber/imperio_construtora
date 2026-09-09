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
 * - Os uniforms do shader foram retunados do cinza metálico para o dourado da
 *   marca: u_shiftRed subiu de 0,3 para 0,72 e u_shiftBlue caiu de 0,3 para
 *   0,04, o que empurra a dispersão para o quente. u_softness e u_repetition
 *   também foram ajustados para um brilho mais contínuo, menos listrado.
 * - As dimensões eram fixas em 142x46 e agora são props.
 * - Aceita href: quando presente vira <a>, que é o certo para um destino de
 *   âncora. Sem href continua <button>.
 * - O ripple do clique foi mantido, mas usa bone em vez de branco puro.
 */

const UNIFORMS_OURO = {
  u_repetition: 3,
  u_softness: 0.72,
  /* O par que define a temperatura: vermelho alto e azul quase nulo. */
  u_shiftRed: 0.72,
  u_shiftBlue: 0.04,
  u_distortion: 0,
  u_contour: 0,
  u_angle: 45,
  u_scale: 8,
  u_shape: 1,
  u_offsetX: 0.1,
  u_offsetY: -0.1,
} as const;

interface LiquidMetalButtonProps {
  label?: string;
  href?: string;
  onClick?: () => void;
  width?: number;
  height?: number;
  className?: string;
}

export function LiquidMetalButton({
  label = "Falar com a Império",
  href,
  onClick,
  width = 232,
  height = 56,
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
        /* Sem WebGL o pill dourado de trás continua no lugar. */
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
    outline: "none",
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
            fontSize: "14px",
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
          background: "#B79653",
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
        >
          {conteudoInterativo}
        </button>
      )}
    </div>
  );
}

export default LiquidMetalButton;
