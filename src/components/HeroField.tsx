import { useEffect, useRef } from "react";

const COR_TINTA = 0x1a1d1a;
const COR_SINAL = 0x2b3fd9;

const LINHAS = 34;
const PONTOS = 96;
const LARGURA = 30;
const ALTURA = 15;

/** Altura do relevo levantado pelo cursor, em unidades de cena. */
const AMPLITUDE = 1.15;
/** Raio de influência do cursor. Maior = morro mais largo e suave. */
const RAIO = 3.4;

/**
 * Curvas de nível atrás do hero: linhas horizontais que se abrem ao redor
 * do cursor, como o relevo de um mapa topográfico.
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
      const camera = new THREE.PerspectiveCamera(55, largura / altura, 0.1, 100);
      camera.position.set(0, -1.5, 15);
      camera.lookAt(0, 0, 0);

      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "low-power",
      });
      renderer.setSize(largura, altura);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      alvo.appendChild(renderer.domElement);

      const grupo = new THREE.Group();
      cena.add(grupo);

      const curvas: {
        geometria: InstanceType<typeof THREE.BufferGeometry>;
        yBase: number;
      }[] = [];
      const descartaveis: { dispose: () => void }[] = [];

      for (let i = 0; i < LINHAS; i++) {
        const yBase = (i / (LINHAS - 1) - 0.5) * ALTURA;
        const posicoes = new Float32Array(PONTOS * 3);

        for (let j = 0; j < PONTOS; j++) {
          posicoes[j * 3] = (j / (PONTOS - 1) - 0.5) * LARGURA;
          posicoes[j * 3 + 1] = yBase;
          posicoes[j * 3 + 2] = 0;
        }

        const geometria = new THREE.BufferGeometry();
        geometria.setAttribute(
          "position",
          new THREE.BufferAttribute(posicoes, 3),
        );

        // Uma linha a cada sete recebe o azul: o destaque marca ritmo,
        // não vira padrão.
        const destaque = i % 7 === 3;
        const material = new THREE.LineBasicMaterial({
          color: destaque ? COR_SINAL : COR_TINTA,
          transparent: true,
          opacity: destaque ? 0.3 : 0.16,
        });

        grupo.add(new THREE.Line(geometria, material));
        curvas.push({ geometria, yBase });
        descartaveis.push(geometria, material);
      }

      // Cursor em coordenadas de cena, seguido com atraso.
      const cursor = { x: 0, y: 0 };
      const suave = { x: 0, y: 0 };

      const aoMover = (evento: PointerEvent) => {
        const caixa = alvo.getBoundingClientRect();
        const nx = (evento.clientX - caixa.left) / caixa.width - 0.5;
        const ny = 0.5 - (evento.clientY - caixa.top) / caixa.height;
        cursor.x = nx * LARGURA;
        cursor.y = ny * ALTURA;
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
      const doisRaioAoQuadrado = 2 * RAIO * RAIO;

      const desenhar = () => {
        quadro = requestAnimationFrame(desenhar);
        if (!visivel) return;

        const t = relogio.getElapsedTime();
        suave.x += (cursor.x - suave.x) * 0.05;
        suave.y += (cursor.y - suave.y) * 0.05;

        for (const { geometria, yBase } of curvas) {
          const atributo = geometria.attributes
            .position as InstanceType<typeof THREE.BufferAttribute>;
          const dy = yBase - suave.y;

          for (let j = 0; j < PONTOS; j++) {
            const x = atributo.getX(j);
            const dx = x - suave.x;

            // Morro gaussiano sob o cursor: as linhas se afastam dele.
            const relevo =
              AMPLITUDE *
              Math.exp(-(dx * dx + dy * dy) / doisRaioAoQuadrado);

            // Ondulação lenta de fundo, para a cena respirar parada.
            const respiro = Math.sin(x * 0.22 + yBase * 0.32 + t * 0.42) * 0.16;

            atributo.setY(j, yBase + relevo + respiro);
          }
          atributo.needsUpdate = true;
        }

        // Inclinação sutil, para o relevo ler como superfície e não como grade.
        grupo.rotation.x = -0.42 + suave.y * 0.012;
        grupo.rotation.z = suave.x * 0.006;

        renderer.render(cena, camera);
      };
      desenhar();

      encerrar = () => {
        cancelAnimationFrame(quadro);
        observador.disconnect();
        window.removeEventListener("pointermove", aoMover);
        window.removeEventListener("resize", aoRedimensionar);
        for (const item of descartaveis) item.dispose();
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
