import { useEffect, useRef } from "react";

const COR_TINTA = 0x1a1d1a;
const COR_SINAL = 0x2b3fd9;

/** Distância entre pontos vizinhos, em unidades de cena. */
const ESPACO = 0.62;
/** Folga além do enquadramento, para a rotação não revelar a borda da grade. */
const FOLGA = 1.35;
/** Distância da câmera ao plano dos pontos. */
const DISTANCIA = 14;

/**
 * Malha de pontos que se inclina conforme o cursor, atrás do hero.
 *
 * A grade é dimensionada a partir do tronco de visão da câmera, então cobre
 * o hero inteiro em qualquer proporção de tela e é refeita ao redimensionar.
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

      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "low-power",
      });
      renderer.setSize(alvo.clientWidth, alvo.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      alvo.appendChild(renderer.domElement);

      const cena = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        60,
        alvo.clientWidth / alvo.clientHeight,
        0.1,
        100,
      );
      camera.position.z = DISTANCIA;

      const tinta = new THREE.Color(COR_TINTA);
      const sinal = new THREE.Color(COR_SINAL);

      const material = new THREE.PointsMaterial({
        size: 0.075,
        vertexColors: true,
        transparent: true,
        opacity: 0.5,
        sizeAttenuation: true,
      });

      let pontos: InstanceType<typeof THREE.Points> | null = null;
      let geometria: InstanceType<typeof THREE.BufferGeometry> | null = null;
      let total = 0;

      /**
       * Recria a grade cobrindo o que a câmera enxerga no plano z = 0.
       * Chamado no início e a cada redimensionamento.
       */
      const montarGrade = () => {
        if (pontos) {
          cena.remove(pontos);
          geometria?.dispose();
        }

        const alturaVisivel =
          2 * Math.tan((camera.fov * Math.PI) / 360) * DISTANCIA;
        const larguraVisivel = alturaVisivel * camera.aspect;

        const colunas = Math.ceil((larguraVisivel * FOLGA) / ESPACO);
        const linhas = Math.ceil((alturaVisivel * FOLGA) / ESPACO);
        total = colunas * linhas;

        const posicoes = new Float32Array(total * 3);
        const cores = new Float32Array(total * 3);

        for (let i = 0; i < colunas; i++) {
          for (let j = 0; j < linhas; j++) {
            const indice = i * linhas + j;
            posicoes[indice * 3] = (i - (colunas - 1) / 2) * ESPACO;
            posicoes[indice * 3 + 1] = (j - (linhas - 1) / 2) * ESPACO;
            posicoes[indice * 3 + 2] = 0;

            // Poucos pontos recebem o azul: o destaque vira exceção,
            // não padrão.
            const cor = Math.random() > 0.88 ? sinal : tinta;
            cores[indice * 3] = cor.r;
            cores[indice * 3 + 1] = cor.g;
            cores[indice * 3 + 2] = cor.b;
          }
        }

        geometria = new THREE.BufferGeometry();
        geometria.setAttribute(
          "position",
          new THREE.BufferAttribute(posicoes, 3),
        );
        geometria.setAttribute("color", new THREE.BufferAttribute(cores, 3));

        pontos = new THREE.Points(geometria, material);
        cena.add(pontos);
      };

      montarGrade();

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
        montarGrade();
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
        if (!visivel || !pontos || !geometria) return;

        const t = relogio.getElapsedTime();

        // O cursor é seguido com atraso: o movimento fica fluido, não nervoso.
        suave.x += (cursor.x - suave.x) * 0.045;
        suave.y += (cursor.y - suave.y) * 0.045;

        const atributo = geometria.attributes
          .position as InstanceType<typeof THREE.BufferAttribute>;
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
        geometria?.dispose();
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
