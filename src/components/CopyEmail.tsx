import { useEffect, useRef, useState } from "react";

interface Props {
  email: string;
  copyLabel: string;
  copiedLabel: string;
}

/**
 * Botão que copia o e-mail para a área de transferência.
 * Se a Clipboard API não estiver disponível (contexto sem HTTPS, navegador
 * antigo), cai para seleção do texto — nunca falha em silêncio.
 */
export default function CopyEmail({ email, copyLabel, copiedLabel }: Props) {
  const [copiado, setCopiado] = useState(false);
  const temporizador = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (temporizador.current) clearTimeout(temporizador.current);
    };
  }, []);

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopiado(true);
      if (temporizador.current) clearTimeout(temporizador.current);
      temporizador.current = setTimeout(() => setCopiado(false), 2000);
    } catch {
      // Sem permissão de clipboard: seleciona o e-mail para o usuário copiar.
      const alvo = document.getElementById("texto-email");
      if (!alvo) return;
      const intervalo = document.createRange();
      intervalo.selectNodeContents(alvo);
      const selecao = window.getSelection();
      selecao?.removeAllRanges();
      selecao?.addRange(intervalo);
    }
  };

  return (
    <button
      type="button"
      onClick={copiar}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-ink-600 px-3 py-2 font-mono text-xs font-medium text-fg-muted transition-colors hover:border-lime-accent hover:text-lime-accent"
      aria-live="polite"
    >
      {copiado ? copiedLabel : copyLabel}
    </button>
  );
}
