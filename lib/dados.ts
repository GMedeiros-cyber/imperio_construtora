/**
 * Conteúdo da home da Império Construtora.
 * A estrutura dos blocos segue o DESIGN.md — aqui vive só o texto.
 */

/* ── 1. Hero ─────────────────────────────────────────────────────────── */

export const hero = {
  /* O tratamento (véu no topo e escurecimento na base) está gravado NO
     ARQUIVO, não em CSS. Foi calculado a partir da luminância medida da foto
     original — ver o comentário do componente. Trocar a foto exige refazer o
     tratamento e remedir. */
  fundo: "/hero/hero-fundo.jpg",
  fundoAlt:
    "Fachada de residência de alto padrão ao entardecer, com iluminação acesa nas varandas.",
  /* Logo da navbar: 160x128 no arquivo, servida a 56px de altura. */
  logo: "/hero/logo-imperio-nav.png",
  logoAlt: "Império Construtora",
  logoLargura: 160,
  logoAltura: 128,
  links: [
    { texto: "OBRAS", href: "#obras" },
    { texto: "COMO TRABALHAMOS", href: "#como-trabalhamos" },
    { texto: "SOBRE", href: "#sobre" },
    { texto: "CONTATO", href: "#contato" },
  ],
  menu: "Menu",
  manchete: ["Do plano ao detalhe.", "Do detalhe à", "excelência."],
  paragrafo:
    "Construção, reforma e gestão de obras com equipe própria, prazo fechado em contrato e orçamento blindado do início ao fim.",
  cta: "Falar com a Império",
} as const;

/* ── 2. O que fazemos ────────────────────────────────────────────────── */

export type NumeroDestaque = { valor: string; descricao: string };

export const oQueFazemos = {
  eyebrow: "O QUE FAZEMOS",
  manchete:
    "Construção, reforma e gestão de obras para varejo, corporativo, residencial e industrial. Equipe própria e prazo fechado em contrato.",
  paragrafo:
    "A Império nasceu da parceria entre um engenheiro civil e um profissional que cresceu na obra ao lado do pai, mestre de obras. São mais de dez anos somados entre formação técnica e canteiro. Trabalhamos com orçamento blindado do início ao fim e controle direto sobre o ritmo de produção.",
  numeros: [
    { valor: "+100", descricao: "lojas e unidades comerciais entregues" },
    { valor: "+10.000", descricao: "metros quadrados construídos e reformados" },
    { valor: "12", descricao: "anos de construção civil" },
  ] as NumeroDestaque[],
} as const;

/* ── 3. Scroll horizontal de obras ───────────────────────────────────── */

export type ObraPainel = {
  rotulo: string;
  titulo: string;
  descricao: string;
  imagem: string;
  tags: string[];
};

export const obrasPaineis: ObraPainel[] = [
  {
    rotulo: "OBRA 01",
    titulo: "Artwalk, Shopping Tamboré",
    descricao:
      "Reforma completa da loja em modelo turnkey, com equipes rotativas em turno de vinte e quatro horas.",
    imagem: "/placeholder/obra-01.svg",
    tags: ["Reforma", "Shopping Tamboré", "Turnkey", "45 dias"],
  },
  {
    rotulo: "OBRA 02",
    titulo: "PETZ, Radial Leste",
    descricao:
      "Gesso liso e drywall, pintura total, instalação de broquete e concregrama.",
    imagem: "/placeholder/obra-02.svg",
    tags: ["Reforma", "Radial Leste", "Gesso e pintura", "60 dias"],
  },
  {
    rotulo: "OBRA 03",
    titulo: "Transportadora Videira",
    descricao:
      "Baldrame, alvenaria perimetral, blocos e sapatas da estrutura do galpão.",
    imagem: "/placeholder/obra-03.svg",
    tags: ["Obra nova", "Galpão", "Estrutura", "120 dias"],
  },
];

/* ── 5b. Faixa de paralaxe ──────────────────────────────────────────── */

export const faixaParalaxe = {
  eyebrow: "DOZE ANOS DE CANTEIRO",
  /* Duas linhas fixas: a quebra é da copy, não do acaso da largura. */
  statement: ["Cada obra entregue é", "um cliente que abriu as portas."],
} as const;

export type ColunaParalaxe = {
  imagem: string;
  /* As classes ficam aqui como strings literais para o Tailwind escaneá-las;
     montadas por concatenação em tempo de execução elas não seriam geradas. */
  classeColuna: string;
  classeWrap: string;
  /** Velocidade do deslocamento; vira yPercent = velocidade * -50. */
  velocidade: number;
  /** Colunas 5 e 6 somem no breakpoint de 479px. */
  escondeMobile?: boolean;
};

export const colunasParalaxe: ColunaParalaxe[] = [
  {
    imagem: "/placeholder/coluna-1.svg",
    classeColuna: "mt-[100vh] max-[480px]:mt-[50rem]",
    classeWrap: "aspect-[213/352]",
    velocidade: 10,
  },
  {
    imagem: "/placeholder/coluna-2.svg",
    classeColuna: "mt-[50vh] max-[480px]:mt-[25rem]",
    classeWrap: "aspect-[213/435]",
    velocidade: 7,
  },
  {
    imagem: "/placeholder/coluna-3.svg",
    classeColuna: "mt-[130vh] max-[480px]:mt-[25rem]",
    classeWrap: "aspect-[213/261]",
    velocidade: 12,
  },
  {
    imagem: "/placeholder/coluna-4.svg",
    classeColuna: "mt-[80vh] max-[480px]:mt-[60rem]",
    classeWrap: "aspect-[213/132]",
    velocidade: 5,
  },
  {
    imagem: "/placeholder/coluna-5.svg",
    classeColuna: "mt-[110vh] max-[480px]:mt-[100rem]",
    classeWrap: "aspect-[213/266]",
    velocidade: 9,
    escondeMobile: true,
  },
  {
    imagem: "/placeholder/coluna-6.svg",
    classeColuna: "mt-[80vh] max-[480px]:mt-[25rem]",
    classeWrap: "aspect-[213/287]",
    velocidade: 6.5,
    escondeMobile: true,
  },
];

/* ── 6 e 7. Cards de obra ────────────────────────────────────────────── */

export type Obra = {
  titulo: string;
  descricao: string;
  imagem?: string;
  alt?: string;
  /** Card de acento: superfície ink, texto gold, sem imagem. Um por página. */
  acento?: boolean;
};

export const secaoObras = {
  eyebrow: "OBRAS ENTREGUES",
  statement: "Mais de cem lojas e unidades comerciais entregues.",
} as const;

export const obrasEntregues: Obra[] = [
  {
    titulo: "PETZ, Radial Leste",
    descricao:
      "Execução de todo o gesso liso e drywall, pintura total, instalação de broquete e concregrama. Sessenta dias de obra.",
    imagem: "/obras/petz-radial-leste.jpg",
    alt: "Fachada da loja Petz na Radial Leste, em São Paulo, com o estacionamento em primeiro plano.",
  },
  {
    titulo: "Restaurante Boali",
    descricao:
      "Reforma completa da loja em modelo turnkey, com noventa dias de execução e foco em acabamento e conformidade normativa.",
    imagem: "/obras/boali-restaurante.jpg",
    alt: "Fachada do restaurante Boali, com letreiro laranja, balcão de atendimento e painel decorativo em giz.",
  },
  {
    titulo: "Transportadora Videira",
    descricao:
      "Baldrame, alvenaria perimetral, blocos e sapatas da estrutura do galpão. Cento e vinte dias de obra.",
    acento: true,
  },
];

export const secaoParticipacao = {
  eyebrow: "PARTICIPAÇÃO TÉCNICA",
  statement:
    "Obras conduzidas por outras construtoras, com atuação técnica nossa em campo.",
} as const;

export const participacaoTecnica: Obra[] = [
  {
    titulo: "Residencial Bella Pietra, Anália Franco",
    descricao:
      "Empreendimento de alto padrão da Riformato Construtora, com apartamentos e studios e infraestrutura completa de lazer.",
    imagem: "/obras/bella-pietra.jpg",
    alt: "Fachada do Residencial Bella Pietra, na Anália Franco.",
  },
  {
    titulo: "Mix Tower Celso Garcia, Belém",
    descricao:
      "Torre da Riformato Construtora na Zona Leste, no conceito Mix Tower, com áreas de lazer completas.",
    imagem: "/obras/mix-tower-celso-garcia.jpg",
    alt: "Torre Mix Tower na avenida Celso Garcia, bairro do Belém, São Paulo.",
  },
  {
    titulo: "AF 377, Moema",
    descricao:
      "Edifício comercial de treze andares da Alfa Realty, com foco em conforto e alta qualidade corporativa.",
    imagem: "/obras/af-377-moema.jpg",
    alt: "Edifício comercial AF 377, em Moema, São Paulo.",
  },
];

/* ── 8. Como trabalhamos ─────────────────────────────────────────────── */

export const secaoModelos = {
  eyebrow: "MODELOS DE ATUAÇÃO",
  statement: "Quatro formas de contratar a obra.",
} as const;

export type Modelo = { titulo: string; descricao: string };

export const modelos: Modelo[] = [
  {
    titulo: "Empreitada global (turnkey)",
    descricao:
      "Assumimos a obra inteira, do material à entrega das chaves, por valor e prazo fechados em contrato.",
  },
  {
    titulo: "Preço por metro quadrado",
    descricao:
      "O contrato é dimensionado pela área a executar, com custo unitário fixado desde a concepção.",
  },
  {
    titulo: "Fit-out fast-track",
    descricao:
      "Reforma corporativa acelerada, em horário noturno ou de fim de semana, com a operação do cliente ativa.",
  },
  {
    titulo: "Gerenciamento open book",
    descricao:
      "Atuamos como braço técnico do cliente. As compras são faturadas em nome dele e cobramos taxa de administração.",
  },
];

export const tipologias: string[] = [
  "VAREJO E FRANQUIAS",
  "ESCRITÓRIOS",
  "CLÍNICAS",
  "RESTAURANTES",
  "RESIDENCIAL MULTIFAMILIAR",
  "ALTO PADRÃO",
  "GALPÕES LOGÍSTICOS",
  "INFRAESTRUTURA",
];

/* ── 9. Clientes ─────────────────────────────────────────────────────── */

export const secaoClientes = {
  eyebrow: "CLIENTES E PARCEIROS",
  statement: "Marcas que já abriram as portas com a gente.",
} as const;

export const clientes: string[] = [
  "PETZ",
  "Artwalk",
  "Boali",
  "Magicfeet",
  "Authentic Feet",
  "Adidas",
  "Líquido",
  "OFOS",
  "Leovit",
  "Transportadora Videira",
  "Riformato Construtora",
];

/* ── 10. Contato ─────────────────────────────────────────────────────── */

export const contato = {
  eyebrow: "CONTATO",
  statement: "Conte para nós sobre a sua próxima obra.",
  /* Telefone e e-mail ainda não definidos — texto literal, não inventar. */
  linhas: [
    { rotulo: "Telefone", valor: "(em definição)" },
    { rotulo: "E-mail", valor: "(em definição)" },
    { rotulo: "Local", valor: "São Paulo, SP" },
  ],
  botao: "Falar com a Império",
} as const;

/* ── 11. Rodapé ──────────────────────────────────────────────────────── */

export type ItemRodape = { texto: string; href?: string };
export type ColunaRodape = { titulo: string; itens: ItemRodape[] };

export const rodape: ColunaRodape[] = [
  {
    titulo: "NAVEGAÇÃO",
    itens: [
      { texto: "Início", href: "#inicio" },
      { texto: "Obras", href: "#obras" },
      { texto: "Contato", href: "#contato" },
    ],
  },
  {
    titulo: "SERVIÇOS",
    itens: [
      { texto: "Construção" },
      { texto: "Reformas" },
      { texto: "Gestão de obras" },
      { texto: "Acabamentos" },
    ],
  },
  {
    titulo: "CONTATO",
    itens: [
      { texto: "(em definição)" },
      { texto: "(em definição)" },
      { texto: "São Paulo, SP" },
    ],
  },
];
