import { PROFILE } from "../data/content";

export type Commit = {
  mensagem: string;
  repositorio: string;
  url: string;
  data: string;
};

const USUARIO = PROFILE.github.split("/").pop() ?? "pdro1409";
const LIMITE = 5;

type EventoPush = {
  type: string;
  created_at: string;
  repo: { name: string };
  payload?: { commits?: { sha: string; message: string }[] };
};

/**
 * Últimos commits públicos, lidos no build.
 *
 * A API só expõe repositórios públicos: o que estiver em repo privado não
 * aparece aqui. Qualquer falha — rede, limite de requisições, formato
 * inesperado — devolve lista vazia, e a seção some em vez de quebrar o build.
 */
export async function buscarCommits(): Promise<Commit[]> {
  try {
    const resposta = await fetch(
      `https://api.github.com/users/${USUARIO}/events/public?per_page=100`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          "User-Agent": "devpdro-portfolio",
        },
        signal: AbortSignal.timeout(6000),
      },
    );

    if (!resposta.ok) return [];

    const eventos = (await resposta.json()) as EventoPush[];
    if (!Array.isArray(eventos)) return [];

    const commits: Commit[] = [];
    const vistos = new Set<string>();

    for (const evento of eventos) {
      if (evento.type !== "PushEvent") continue;

      for (const commit of evento.payload?.commits ?? []) {
        // Só a primeira linha interessa, e merge não conta como trabalho.
        const mensagem = commit.message.split("\n")[0].trim();
        if (!mensagem || mensagem.startsWith("Merge ")) continue;
        if (vistos.has(mensagem)) continue;
        vistos.add(mensagem);

        commits.push({
          mensagem,
          repositorio: evento.repo.name.split("/").pop() ?? evento.repo.name,
          url: `https://github.com/${evento.repo.name}/commit/${commit.sha}`,
          data: evento.created_at,
        });

        if (commits.length >= LIMITE) return commits;
      }
    }

    return commits;
  } catch {
    return [];
  }
}

/** "há 3 dias" / "3 days ago", a partir da data do commit. */
export function tempoRelativo(iso: string, locale: "pt" | "en"): string {
  const dias = Math.round((Date.now() - new Date(iso).getTime()) / 86_400_000);
  const formatador = new Intl.RelativeTimeFormat(
    locale === "pt" ? "pt-BR" : "en",
    { numeric: "auto" },
  );

  if (dias < 1) return formatador.format(0, "day");
  if (dias < 30) return formatador.format(-dias, "day");
  return formatador.format(-Math.round(dias / 30), "month");
}
