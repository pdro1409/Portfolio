import { useEffect, useRef } from "react";

const COR_TINTA = 0x1a1d1a;
const COR_SINAL = 0x2b3fd9;

/**
 * Malha de pontos que se inclina conforme o cursor, atrás do hero.
 *
 * É decoração: fica atrás do conteúdo, com aria-hidden, e não carrega em
 * tela pequena nem para quem pediu menos movimento. O import do three é
 * dinâmico para o bundle não pesar em quem nunca vai ver a cena.
 */
export default function HeroField() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const alvo = container.current;
    if (!alvo) return;

    const semMovimento = window.matchMedia("(prefers-reduced-motion: reduce)");
    const telaPequena = window.matchMedia("(max-width: 767px)");
    if (semMovimento.matches || telaPequena.matches) return;

    let encerrar: (() => void) | undefined;
    let cancelado = false;

    (async () => {
      const THREE = await import("three");
      if (cancelado || !alvo.isConnected) return;

      const largura = alvo.clientWidth;
      const altura = alvo.clientHeight;

      const cena = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(60, largura / altura, 0.1, 100);
      camera.position.z = 14;

      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "low-power",
      });
      renderer.setSize(largura, altura);
      // Acima de 2 o ganho visual some e o custo de GPU dobra.
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      alvo.appendChild(renderer.domElement);

      // Grade de pontos no plano XY, com profundidade em ondas.
      const COLUNAS = 46;
      const LINHAS = 26;
      const ESPACO = 0.62;
      const total = COLUNAS * LINHAS;

      const posicoes = new Float32Array(total * 3);
      const cores = new Float32Array(total * 3);
      const tinta = new THREE.Color(COR_TINTA);
      const sinal = new THREE.Color(COR_SINAL);

      for (let i = 0; i < COLUNAS; i++) {
        for (let j = 0; j < LINHAS; j++) {
          const indice = i * LINHAS + j;
          posicoes[indice * 3] = (i - COLUNAS / 2) * ESPACO;
          posicoes[indice * 3 + 1] = (j - LINHAS / 2) * ESPACO;
          posicoes[indice * 3 + 2] = 0;

          // Poucos pontos recebem o azul: o destaque vira exceção, não padrão.
          const cor = Math.random() > 0.88 ? sinal : tinta;
          cores[indice * 3] = cor.r;
          cores[indice * 3 + 1] = cor.g;
          cores[indice * 3 + 2] = cor.b;
        }
      }

      const geometria = new THREE.BufferGeometry();
      geometria.setAttribute("position", new THREE.BufferAttribute(posicoes, 3));
      geometria.setAttribute("color", new THREE.BufferAttribute(cores, 3));

      const material = new THREE.PointsMaterial({
        size: 0.075,
        vertexColors: true,
        transparent: true,
        opacity: 0.5,
        sizeAttenuation: true,
      });

      const pontos = new THREE.Points(geometria, material);
      cena.add(pontos);

      const cursor = { x: 0, y: 0 };
      const suave = { x: 0, y: 0 };

      const aoMover = (evento: PointerEvent) => {
        const caixa = alvo.getBoundingClientRect();
        cursor.x = ((evento.clientX - caixa.left) / caixa.width) * 2 - 1;
        cursor.y = ((evento.clientY - caixa.top) / caixa.height) * 2 - 1;
      };
      window.addEventListener("pointermove", aoMover, { passive: true });

      const aoRedimensionar = () => {
        const l = alvo.clientWidth;
        const a = alvo.clientHeight;
        camera.aspect = l / a;
        camera.updateProjectionMatrix();
        renderer.setSize(l, a);
      };
      window.addEventListener("resize", aoRedimensionar);

      // Pausa a cena quando o hero sai da tela — nada de animar fora de vista.
      let visivel = true;
      const observador = new IntersectionObserver(
        ([entrada]) => {
          visivel = entrada.isIntersecting;
        },
        { threshold: 0 },
      );
      observador.observe(alvo);

      let quadro = 0;
      const relogio = new THREE.Clock();

      const desenhar = () => {
        quadro = requestAnimationFrame(desenhar);
        if (!visivel) return;

        const t = relogio.getElapsedTime();

        // O cursor é seguido com atraso: o movimento fica fluido, não nervoso.
        suave.x += (cursor.x - suave.x) * 0.045;
        suave.y += (cursor.y - suave.y) * 0.045;

        const atributo = geometria.attributes.position as THREE.BufferAttribute;
        for (let i = 0; i < total; i++) {
          const x = atributo.getX(i);
          const y = atributo.getY(i);
          const distancia = Math.hypot(x - suave.x * 9, y - suave.y * 5);
          atributo.setZ(i, Math.sin(distancia * 0.7 - t * 1.1) * 0.62);
        }
        atributo.needsUpdate = true;

        pontos.rotation.x = suave.y * 0.14;
        pontos.rotation.y = suave.x * 0.2;

        renderer.render(cena, camera);
      };
      desenhar();

      encerrar = () => {
        cancelAnimationFrame(quadro);
        observador.disconnect();
        window.removeEventListener("pointermove", aoMover);
        window.removeEventListener("resize", aoRedimensionar);
        geometria.dispose();
        material.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    })();

    return () => {
      cancelado = true;
      encerrar?.();
    };
  }, []);

  return (
    <div
      ref={container}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    />
  );
}
