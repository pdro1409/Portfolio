export type Locale = "pt" | "en";

export type Project = {
  slug: string;
  title: string;
  /** Onde e quando: "Grupo Máquina de Vendas, 2026" */
  context: string;
  /** Narrativa em primeira pessoa. Um a dois parágrafos. */
  story: string[];
  stack: string[];
  image: string;
  imageAlt: string;
  /** Cor do painel atrás da tela. Puxada da própria interface do projeto. */
  accent: string;
  live?: string;
  repo?: string;
  /** Preenchido quando o código é fechado, explicando o porquê. */
  closedSource?: string;
};

/** Uma tecnologia da vitrine. `icon` é o slug em /assets/icons/<slug>.svg. */
export type Tech = { name: string; icon?: string };

export type Job = {
  company: string;
  role: string;
  period: string;
  story: string[];
  stack: string[];
};

export type Content = {
  meta: { title: string; description: string; ogAlt: string };
  nav: {
    work: string;
    path: string;
    tools: string;
    contact: string;
    otherLang: string;
    otherLangAria: string;
    menu: string;
    skip: string;
  };
  hero: {
    statement: string;
    intro: string;
    photoAlt: string;
    resume: string;
    linkedin: string;
  };
  projects: { title: string; lead: string; items: Project[]; live: string; code: string };
  experience: { title: string; lead: string; items: Job[] };
  stack: {
    title: string;
    lead: string;
    primary: Tech[];
    secondaryLead: string;
    secondary: Tech[];
  };
  about: {
    title: string;
    body: string[];
    education: { label: string; degree: string; school: string; period: string };
    languages: { label: string; items: { name: string; level: string }[] };
  };
  contact: { title: string; lead: string; copy: string; copied: string; resume: string };
  footer: { note: string; source: string };
};

export const PROFILE = {
  name: "Pedro Augusto",
  email: "panuness1010@gmail.com",
  linkedin: "https://www.linkedin.com/in/pdro1409/",
  github: "https://github.com/pdro1409",
  resume: "/curriculo-pedro-augusto.pdf",
  domain: "https://devpdro.com.br",
  source: "https://github.com/pdro1409/Portfolio",
} as const;

const PRIMARY_STACK: Tech[] = [
  { name: "TypeScript", icon: "ts-icon" },
  { name: "React", icon: "react-icon" },
  { name: "Next.js", icon: "next-icon" },
  { name: "Node.js", icon: "node-icon" },
  { name: "Express", icon: "express" },
  { name: "NestJS", icon: "nestjs" },
  { name: "PostgreSQL", icon: "postgresql" },
  { name: "Docker", icon: "docker" },
];

const SECONDARY_STACK: Tech[] = [
  { name: "Redis", icon: "redis" },
  { name: "Supabase", icon: "supabase" },
  { name: "Astro", icon: "astro-icon" },
  { name: "Tailwind", icon: "tailwind-icon" },
  { name: "Playwright", icon: "playwright" },
  { name: "Vitest", icon: "vitest" },
  { name: "PHP", icon: "php-icon" },
  { name: "Laravel", icon: "laravel" },
  { name: "Python", icon: "python" },
  { name: "MySQL", icon: "mysql" },
];

export const content: Record<Locale, Content> = {
  pt: {
    meta: {
      title: "Pedro Augusto — desenvolvedor full stack",
      description:
        "Desenvolvedor full stack em Goiânia. Arquitetei e escrevi o CRM com IA que mais de 200 clientes usam para vender. React, Next.js, Node e PostgreSQL.",
      ogAlt: "Pedro Augusto, desenvolvedor full stack",
    },
    nav: {
      work: "Trabalhos",
      path: "Trajetória",
      tools: "Ferramentas",
      contact: "Contato",
      otherLang: "English",
      otherLangAria: "Read this page in English",
      menu: "Menu",
      skip: "Pular para o conteúdo",
    },
    hero: {
      statement: "Eu construo os sistemas que as empresas usam o dia inteiro.",
      intro:
        "Sou Pedro Augusto, desenvolvedor full stack em Goiânia. Comecei conferindo dados em sistema público, passei por aplicações e APIs em Laravel, e hoje arquiteto e escrevo o CRM com inteligência artificial que mais de 200 clientes usam para vender — do modelo de dados à tela.",
      photoAlt: "Pedro Augusto",
      resume: "Baixar currículo",
      linkedin: "LinkedIn",
    },
    projects: {
      title: "Trabalhos",
      lead: "Três sistemas em produção. O que fiz em cada um, e o que mudou depois.",
      live: "Ver no ar",
      code: "Ver código",
      items: [
        {
          slug: "crm-maquinia",
          title: "CRM MaquinIA",
          context: "Grupo Máquina de Vendas, 2026",
          story: [
            "A operação vivia em planilhas, uma por corretor, sem rastro do lead. Assumi o sistema que substituiu isso e fiz as duas pontas: API em Node com Express, autenticação por JWT e controle de acesso por papel aplicado no próprio PostgreSQL, consultas tipadas com Kysely, importador de carteiras em fases e a camada de IA que conduz o atendimento.",
            "Mais de 200 clientes usam todo dia. Cobri o caminho crítico com Playwright, testes de integração da API e testes no banco — aqui um erro de permissão vaza dado de um cliente para outro.",
          ],
          stack: ["TypeScript", "Node.js", "Express", "JWT", "RBAC", "PostgreSQL", "React", "Playwright"],
          image: "/assets/projects/crm-maquinia.png",
          imageAlt: "Tela do CRM MaquinIA",
          accent: "#6d28d9",
          live: "https://os.maquinia.com.br/",
          closedSource: "Código fechado — é o produto interno da empresa.",
        },
        {
          slug: "d-a-leiloes",
          title: "D.A — controle financeiro",
          context: "Projeto próprio, 2026",
          story: [
            "Uma operação de leilões controlava dinheiro em planilhas paralelas, com todo mundo enxergando tudo. Construí o app que ocupou esse lugar: Next.js 16 com Server Actions, permissão por perfil no Supabase com RLS e validação com Zod em toda entrada.",
            "Entreguei em fatias, cada uma por pull request e coberta por Vitest. É onde meu processo aparece inteiro — por isso o código está aberto.",
          ],
          stack: ["Next.js 16", "React 19", "TypeScript", "Supabase", "Zod", "Vitest"],
          image: "/assets/projects/d-a-leiloes.png",
          imageAlt: "Tela do D.A controle financeiro",
          accent: "#15803d",
          repo: "https://github.com/pdro1409/d-a-leiloes",
        },
        {
          slug: "sites-renderer",
          title: "Sites Renderer",
          context: "Grupo Máquina de Vendas, 2026",
          story: [
            "Cada cliente pedia o próprio site, e manter dezenas de projetos quase iguais travava a entrega. Escrevi um motor em Next.js que monta o site a partir dos dados: busca de imóvel por região no Mapbox, formulários com React Hook Form e Zod, imagens otimizadas com sharp.",
            "Um código-base passou a atender todos. O que era um projeto novo por contrato virou configuração.",
          ],
          stack: ["Next.js", "React", "Mapbox", "Zod", "Testing Library", "sharp"],
          image: "/assets/projects/sites-renderer.png",
          imageAlt: "Tela do Sites Renderer",
          accent: "#4338ca",
          closedSource: "Código fechado — é o produto interno da empresa.",
        },
      ],
    },
    experience: {
      title: "Trajetória",
      lead: "De conferir registro público a responder pela arquitetura de um produto.",
      items: [
        {
          company: "Grupo Máquina de Vendas",
          role: "Desenvolvedor de software pleno",
          period: "jan 2026 — hoje",
          story: [
            "Respondo pela arquitetura e pelo desenvolvimento do CRM da empresa, do banco à interface. Escrevi a API em Node e Express com autenticação JWT e controle de acesso por papel no PostgreSQL, montei a camada de IA que conduz o atendimento e estruturei filas e cache em Redis para o sistema aguentar o crescimento.",
            "Conduzo os módulos críticos de forma independente, documentando as decisões em System Design Documents antes de escrever código. Padronizei os ambientes em Docker.",
          ],
          stack: ["Node.js", "Express", "TypeScript", "PostgreSQL", "Redis", "Docker"],
        },
        {
          company: "BecoDiagonal",
          role: "Desenvolvedor de software júnior",
          period: "jul 2025 — jan 2026",
          story: [
            "Desenvolvi aplicações web multiusuário em React e mantive as APIs em PHP e Laravel que as sustentavam, com atenção a segurança e a tempo de resposta. Atuei no ciclo inteiro, da análise de requisito à implantação em nuvem, e sentei junto de produto e cliente para definir o que seria construído.",
          ],
          stack: ["React", "JavaScript", "PHP", "Laravel", "REST"],
        },
        {
          company: "Jucetins — Junta Comercial do Tocantins",
          role: "Estagiário",
          period: "nov 2023 — jul 2025",
          story: [
            "Onde eu aprendi a levar dado a sério. Conferi e corrigi registros em sistemas do governo, resolvendo inconsistências em bases MySQL e MariaDB e dando suporte a quem usava as plataformas internas. Foi aqui que entendi o custo de um dado errado antes de aprender a escrever o sistema que o evita.",
          ],
          stack: ["MySQL", "MariaDB", "SQL"],
        },
      ],
    },
    stack: {
      title: "Ferramentas",
      lead: "O que uso todo dia:",
      primary: PRIMARY_STACK,
      secondaryLead: "E o que já entreguei em produção antes:",
      secondary: SECONDARY_STACK,
    },
    about: {
      title: "Sobre",
      body: [
        "Gosto de trabalhar nas duas pontas. Modelar o banco e as regras de negócio me diverte tanto quanto entregar a tela que a pessoa usa — e acho que fazer só metade disso deixa a outra metade pior.",
        "Trabalho em fatias verticais: cada pedaço nasce completo, com teste, e passa por pull request. Não é rigor por rigor. É que sistema com usuário de verdade não perdoa desleixo, e eu já vi de perto o estrago que um dado errado faz.",
      ],
      education: {
        label: "Formação",
        degree: "Bacharelado em Engenharia de Software",
        school: "UNIALFA — Centro Universitário Alves Faria",
        period: "2025 — 2029",
      },
      languages: {
        label: "Idiomas",
        items: [
          { name: "Português", level: "nativo" },
          { name: "Inglês", level: "técnico, intermediário" },
        ],
      },
    },
    contact: {
      title: "Vamos conversar",
      lead: "Estou aberto a vagas de desenvolvedor full stack, remoto ou em Goiânia. Me escreva.",
      copy: "Copiar",
      copied: "Copiado",
      resume: "Baixar currículo",
    },
    footer: {
      note: "Feito em Astro, React e Tailwind, em Goiânia.",
      source: "Código deste site",
    },
  },

  en: {
    meta: {
      title: "Pedro Augusto — full stack developer",
      description:
        "Full stack developer in Goiânia, Brazil. I architected and wrote the AI-powered CRM that 200+ clients use to sell. React, Next.js, Node and PostgreSQL.",
      ogAlt: "Pedro Augusto, full stack developer",
    },
    nav: {
      work: "Work",
      path: "Path",
      tools: "Tools",
      contact: "Contact",
      otherLang: "Português",
      otherLangAria: "Ler esta página em português",
      menu: "Menu",
      skip: "Skip to content",
    },
    hero: {
      statement: "I build the systems companies sit inside all day.",
      intro:
        "I'm Pedro Augusto, a full stack developer in Goiânia, Brazil. I started out checking records in a government system, moved on to web apps and Laravel APIs, and today I architect and write the AI-powered CRM that more than 200 clients use to sell — from the data model to the screen.",
      photoAlt: "Pedro Augusto",
      resume: "Download résumé",
      linkedin: "LinkedIn",
    },
    projects: {
      title: "Work",
      lead: "Three systems in production. What I did on each, and what changed afterwards.",
      live: "Visit",
      code: "Read the code",
      items: [
        {
          slug: "crm-maquinia",
          title: "CRM MaquinIA",
          context: "Grupo Máquina de Vendas, 2026",
          story: [
            "The business ran on spreadsheets, one per agent, no trace of a lead. I took on the system that replaced it and built both ends: a Node and Express API, JWT authentication with role-based access enforced inside PostgreSQL itself, typed queries through Kysely, a phased portfolio importer, and the AI layer that drives the conversation.",
            "More than 200 clients use it daily. I covered the critical path with Playwright, API integration tests and tests against the database itself, because a permission bug here leaks one client's data into another's.",
          ],
          stack: ["TypeScript", "Node.js", "Express", "JWT", "RBAC", "PostgreSQL", "React", "Playwright"],
          image: "/assets/projects/crm-maquinia.png",
          imageAlt: "CRM MaquinIA screen",
          accent: "#6d28d9",
          live: "https://os.maquinia.com.br/",
          closedSource: "Closed source — it is the company's internal product.",
        },
        {
          slug: "d-a-leiloes",
          title: "D.A — financial control",
          context: "Own project, 2026",
          story: [
            "An auction business tracked money across parallel spreadsheets, with no reliable history and everyone seeing everything. I built the app that took its place: Next.js 16 with Server Actions, role-based auth on Supabase with RLS, and Zod validation at every entry point — because bad data on the way in is what breaks the month-end close.",
            "I worked in vertical slices, each shipped as a pull request and covered by Vitest with coverage reporting. It is the project where my process shows end to end, which is why the code is open.",
          ],
          stack: ["Next.js 16", "React 19", "TypeScript", "Supabase", "Zod", "Vitest"],
          image: "/assets/projects/d-a-leiloes.png",
          imageAlt: "D.A financial control screen",
          accent: "#15803d",
          repo: "https://github.com/pdro1409/d-a-leiloes",
        },
        {
          slug: "sites-renderer",
          title: "Sites Renderer",
          context: "Grupo Máquina de Vendas, 2026",
          story: [
            "Every client wanted their own website, and maintaining dozens of near-identical projects was choking delivery. I wrote a Next.js engine that assembles a site from the client's own data: property search by region on Mapbox, forms validated with React Hook Form and Zod, images optimized through sharp, and fonts served from our own domain so the site opens fast on a phone.",
            "One codebase now serves every client. What used to be a new project per contract became configuration.",
          ],
          stack: ["Next.js", "React", "Mapbox", "Zod", "Testing Library", "sharp"],
          image: "/assets/projects/sites-renderer.png",
          imageAlt: "Sites Renderer screen",
          accent: "#4338ca",
          closedSource: "Closed source — it is the company's internal product.",
        },
      ],
    },
    experience: {
      title: "Path",
      lead: "From checking public records to owning a product's architecture.",
      items: [
        {
          company: "Grupo Máquina de Vendas",
          role: "Mid-level software developer",
          period: "Jan 2026 — present",
          story: [
            "I own the architecture and development of the company's CRM, from the database to the interface. I wrote the Node and Express API with JWT authentication and role-based access enforced in PostgreSQL, built the AI layer that drives customer service, and structured queues and Redis caching so the system holds up as it grows.",
            "I lead the critical modules independently, writing System Design Documents before writing code. I standardized environments on Docker.",
          ],
          stack: ["Node.js", "Express", "TypeScript", "PostgreSQL", "Redis", "Docker"],
        },
        {
          company: "BecoDiagonal",
          role: "Junior software developer",
          period: "Jul 2025 — Jan 2026",
          story: [
            "I built multi-user web applications in React and maintained the PHP and Laravel APIs behind them, with attention to security and response time. I worked the full cycle, from requirements to cloud deployment, and sat with product and clients to define what would be built.",
          ],
          stack: ["React", "JavaScript", "PHP", "Laravel", "REST"],
        },
        {
          company: "Jucetins — Tocantins Board of Trade",
          role: "Intern",
          period: "Nov 2023 — Jul 2025",
          story: [
            "Where I learned to take data seriously. I checked and corrected records in government systems, resolving inconsistencies across MySQL and MariaDB and supporting the people who used the internal platforms. This is where I understood the cost of wrong data, before I learned to write the system that prevents it.",
          ],
          stack: ["MySQL", "MariaDB", "SQL"],
        },
      ],
    },
    stack: {
      title: "Tools",
      lead: "What I use every day:",
      primary: PRIMARY_STACK,
      secondaryLead: "And what I've shipped to production before:",
      secondary: SECONDARY_STACK,
    },
    about: {
      title: "About",
      body: [
        "I like working at both ends. Modelling the database and the business rules is as good a time as shipping the screen someone actually uses — and doing only half of it tends to make the other half worse.",
        "I work in vertical slices: every piece arrives complete, with tests, through a pull request. That isn't rigour for its own sake. Systems with real users don't forgive sloppiness, and I've seen up close what one wrong record costs.",
      ],
      education: {
        label: "Education",
        degree: "BSc in Software Engineering",
        school: "UNIALFA — Centro Universitário Alves Faria",
        period: "2025 — 2029",
      },
      languages: {
        label: "Languages",
        items: [
          { name: "Portuguese", level: "native" },
          { name: "English", level: "technical, intermediate" },
        ],
      },
    },
    contact: {
      title: "Let's talk",
      lead: "I'm open to full stack developer roles, remote or in Goiânia. Write to me.",
      copy: "Copy",
      copied: "Copied",
      resume: "Download résumé",
    },
    footer: {
      note: "Built with Astro, React and Tailwind, in Goiânia.",
      source: "Source of this site",
    },
  },
};

export const getContent = (locale: Locale): Content => content[locale];
