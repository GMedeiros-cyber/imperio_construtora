/**
 * Conteúdo da home da Império Construtora.
 * A estrutura dos blocos segue o DESIGN.md — aqui vive só o texto.
 */

/* ── 1. Header lockup ────────────────────────────────────────────────── */

export const cabecalho = {
  /* Eyebrow em duas linhas, caixa alta */
  eyebrow: ["CONSTRUÇÃO, REFORMA E GESTÃO DE OBRAS", "SÃO PAULO // BRASIL"],
  /* Marca circular — a coroa entra depois em SVG */
  marca: "I",
  menu: "Menu",
} as const;

/* ── 2. Display poster ───────────────────────────────────────────────── */

export const display = {
  linhas: ["Do plano ao detalhe.", "Do detalhe à excelência."],
} as const;

/* ── 3. Hero image band ──────────────────────────────────────────────── */

export const hero = {
  imagem: "/obras/artwalk-tambore.jpg",
  alt: "Fachada da loja Artwalk no Shopping Tamboré, com letreiro luminoso e vitrines de tênis iluminadas.",
  meta: "ARTWALK // SHOPPING TAMBORÉ, SÃO PAULO",
  headline:
    "Quarenta e cinco dias, equipes rotativas em turno de vinte e quatro horas.",
} as const;

/* ── 4. Números ──────────────────────────────────────────────────────── */

export type Numero = { valor: string; rotulo: string };

export const numeros: Numero[] = [
  { valor: "+100", rotulo: "LOJAS E UNIDADES COMERCIAIS ENTREGUES" },
  { valor: "+10.000", rotulo: "METROS QUADRADOS CONSTRUÍDOS E REFORMADOS" },
  { valor: "12", rotulo: "ANOS DE CONSTRUÇÃO CIVIL" },
  { valor: "100%", rotulo: "MÃO DE OBRA PRÓPRIA E QUALIFICADA" },
];

/* ── 5. Quem somos ───────────────────────────────────────────────────── */

export const quemSomos = {
  eyebrow: "QUEM SOMOS",
  statement: "Engenharia de precisão e tradição construtiva, na mesma obra.",
  colunas: [
    "A Império nasceu da parceria entre um engenheiro civil e um profissional que cresceu na obra ao lado do pai, mestre de obras. São mais de dez anos somados entre formação técnica e canteiro.",
    "Trabalhamos com equipe própria, cronograma fechado em contrato e controle direto sobre o ritmo de produção. Cada obra é conduzida com orçamento blindado do início ao fim.",
  ],
} as const;

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
