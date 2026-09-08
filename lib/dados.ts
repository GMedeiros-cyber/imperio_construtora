/**
 * Conteúdo da home da Império Construtora.
 * A estrutura dos blocos segue o DESIGN.md — aqui vive só o texto.
 */

export const cabecalho = {
  /* Eyebrow em duas linhas, caixa alta */
  eyebrow: ["CONSTRUÇÃO, REFORMA E GESTÃO DE OBRAS", "SÃO PAULO // BRASIL"],
  /* Marca circular — a coroa entra depois em SVG */
  marca: "I",
  menu: "Menu",
} as const;

export const display = {
  linhas: ["Do plano ao detalhe.", "Do detalhe à excelência."],
} as const;

export const hero = {
  imagem: "/obra/petz-radial-leste.jpg",
  alt: "Fachada da loja Petz na Radial Leste, em São Paulo, com o estacionamento em primeiro plano.",
  meta: "PETZ // RADIAL LESTE, SÃO PAULO",
  headline: "Sessenta dias, equipes rotativas em turno de vinte e quatro horas.",
} as const;

export const secaoObras = {
  eyebrow: "OBRAS ENTREGUES",
  headline: "Mais de cem lojas e unidades comerciais entregues.",
} as const;

export type Obra = {
  titulo: string;
  descricao: string;
  imagem?: string;
  alt?: string;
  /** Card de acento: superfície ink, texto gold, sem imagem. Um por linha. */
  acento?: boolean;
};

export const obras: Obra[] = [
  {
    titulo: "Artwalk, Shopping Tamboré",
    descricao:
      "Reforma completa da loja em modelo turnkey, entregue em quarenta e cinco dias com equipes rotativas em turno de vinte e quatro horas.",
    imagem: "/obra/artwalk-tambore.jpg",
    alt: "Fachada da loja Artwalk no Shopping Tamboré, com letreiro luminoso e vitrines de tênis iluminadas.",
  },
  {
    titulo: "Restaurante Boali",
    descricao:
      "Reforma completa da loja em modelo turnkey, com noventa dias de execução e foco em acabamento e conformidade normativa.",
    imagem: "/obra/boali-restaurante.jpg",
    alt: "Fachada do restaurante Boali, com letreiro laranja, balcão de atendimento e painel decorativo em giz.",
  },
  {
    titulo: "Transportadora Videira",
    descricao:
      "Baldrame, alvenaria perimetral, blocos e sapatas da estrutura do galpão. Cento e vinte dias de obra.",
    acento: true,
  },
];

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
    /* Telefone e e-mail ainda não definidos — texto literal, não inventar. */
    titulo: "CONTATO",
    itens: [
      { texto: "(em definição)" },
      { texto: "(em definição)" },
      { texto: "São Paulo, SP" },
    ],
  },
];
