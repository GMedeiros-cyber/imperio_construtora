import fundoLargo from "@/public/hero/hero-wide.jpg";
import fundoAlto from "@/public/hero/hero-tall.jpg";
import logoNav from "@/public/hero/logo-imperio-nav.png";

/**
 * Conteúdo da home da Império Construtora.
 * A estrutura dos blocos segue o DESIGN.md — aqui vive só o texto.
 */

/* ── 1. Hero ─────────────────────────────────────────────────────────── */

export const hero = {
  /* Duas fotos por direção de arte: a larga no desktop, a alta no mobile.
     Import estático para o Next gerar a URL com hash do conteúdo — com
     caminho fixo em string, o otimizador servia a imagem velha por até 4h.

     As duas já vêm tratadas, com o escurecimento da base gravado NO ARQUIVO.
     Não há véu no topo: o céu de crepúsculo já dá contraste. Foi calculado a partir da luminância medida da foto
     original — ver o comentário do componente. Trocar a foto exige refazer o
     tratamento e remedir. */
  fundoLargo,
  fundoAlto,
  fundoAlt:
    "Fachada de residência contemporânea ao entardecer, com iluminação acesa e jardim frontal.",
  /* Logo da navbar: 160x128 no arquivo, servida a 56px de altura. */
  logo: logoNav,
  logoAlt: "Império Construtora",
  manchete: ["Do plano ao detalhe.", "Do detalhe à", "excelência."],
  paragrafo:
    "Construção, reforma e gestão de obras com equipe própria, prazo fechado em contrato e orçamento blindado do início ao fim.",
  cta: "Falar com a Império",
} as const;

/* ── 1c. Ícones sociais da hero ──────────────────────────────────────── */

export const sociaisHero = [
  {
    tipo: "instagram" as const,
    rotulo: "Instagram da Império Construtora",
    href: "https://www.instagram.com/_construtoraimperio",
  },
  {
    tipo: "email" as const,
    rotulo: "Enviar e-mail para a Império Construtora",
    href: "mailto:contato@imperioconstrutora.com.br",
  },
  /* Sem link por enquanto: é só a marcação de praça. */
  { tipo: "local" as const, rotulo: "Guarulhos, São Paulo" },
];

/* ── 1b. Menu da hero ────────────────────────────────────────────────── */

export const menuHero = {
  abrir: "MENU",
  fechar: "FECHAR",
  itens: [
    { texto: "Obras", href: "#obras" },
    { texto: "Sobre", href: "#sobre" },
    { texto: "Como trabalhamos", href: "#como-trabalhamos" },
    { texto: "Contato", href: "#contato" },
  ],
  contatoRotulo: "CONTATO",
  contatoLinhas: [
    {
      tipo: "email" as const,
      texto: "contato@imperioconstrutora.com.br",
      href: "mailto:contato@imperioconstrutora.com.br",
    },
    {
      tipo: "instagram" as const,
      texto: "@_construtoraimperio",
      href: "https://www.instagram.com/_construtoraimperio",
    },
    { tipo: "local" as const, texto: "Guarulhos, SP" },
  ] as { tipo: "email" | "instagram" | "local"; texto: string; href?: string }[],
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
  /* Caminho solto de propósito: as fotos das obras 02 e 03 ainda não vieram e
     entram aqui trocando só esta linha. Enquanto isso apontam para um
     placeholder graphite numerado, quadrado como a foto real. */
  imagem: string;
  /* Vazio quando a imagem é placeholder: o alt de um espaço reservado é ruído
     para o leitor de tela, e a legenda ao lado já nomeia a obra. */
  imagemAlt: string;
  tags: string[];
};

export const obrasPaineis: ObraPainel[] = [
  {
    rotulo: "OBRA 01",
    titulo: "Artwalk, Shopping Tamboré",
    descricao:
      "Reforma completa da loja em modelo turnkey, com equipes rotativas em turno de vinte e quatro horas.",
    imagem: "/obras/artwalk-tambore.jpg",
    imagemAlt:
      "Fachada da loja Artwalk no Shopping Tamboré, recém-entregue, com letreiro em neon e parede de cimento queimado.",
    tags: ["Reforma", "Shopping Tamboré", "Turnkey", "45 dias"],
  },
  {
    rotulo: "OBRA 02",
    titulo: "PETZ, Radial Leste",
    descricao:
      "Gesso liso e drywall, pintura total, instalação de broquete e concregrama.",
    imagem: "/obras/placeholder-02.svg",
    imagemAlt: "",
    tags: ["Reforma", "Radial Leste", "Gesso e pintura", "60 dias"],
  },
  {
    rotulo: "OBRA 03",
    titulo: "Transportadora Videira",
    descricao:
      "Baldrame, alvenaria perimetral, blocos e sapatas da estrutura do galpão.",
    imagem: "/obras/placeholder-03.svg",
    imagemAlt: "",
    tags: ["Obra nova", "Galpão", "Estrutura", "120 dias"],
  },
];

/* Rodapé da seção: trilho de progresso, contador e a saída para a lista
   completa. O total sai do tamanho do array, não de um número escrito à mão. */
export const obrasScroll = {
  verTodas: "Ver todas as obras",
  verTodasHref: "#obras",
  /* Rótulo do link de cada foto, lido pelo cursor customizado. */
  cursor: "Ver obra",
} as const;

/* ── 5b. Faixa de paralaxe ──────────────────────────────────────────── */

export const faixaParalaxe = {
  /* Duas linhas fixas: a quebra é da copy, não do acaso da largura. */
  statement: ["Cada obra entregue", "é parte da história."],
} as const;

/* União discriminada, e não um campo "poster" opcional solto: assim o
   componente não tem como renderizar <video> sem pôster nem <img> com ele. */
export type MidiaColuna =
  | { tipo: "imagem"; src: string }
  | { tipo: "video"; src: string; poster: string };

export type ColunaParalaxe = {
  midia: MidiaColuna;
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
    midia: {
      tipo: "video",
      src: "/faixa/obra-video-2.mp4",
      poster: "/faixa/obra-video-2-poster.jpg",
    },
    classeColuna: "mt-[100vh] max-[480px]:mt-[50rem]",
    classeWrap: "aspect-[213/352]",
    velocidade: 10,
  },
  {
    midia: {
      tipo: "video",
      src: "/faixa/obra-video-1.mp4",
      poster: "/faixa/obra-video-1-poster.jpg",
    },
    classeColuna: "mt-[50vh] max-[480px]:mt-[25rem]",
    classeWrap: "aspect-[213/435]",
    velocidade: 7,
  },
  {
    midia: { tipo: "imagem", src: "/faixa/casa-em-obra.jpg" },
    classeColuna: "mt-[130vh] max-[480px]:mt-[25rem]",
    classeWrap: "aspect-[213/261]",
    velocidade: 12,
  },
  {
    midia: { tipo: "imagem", src: "/faixa/analia-franco.jpg" },
    classeColuna: "mt-[80vh] max-[480px]:mt-[60rem]",
    classeWrap: "aspect-[213/132]",
    velocidade: 5,
  },
  {
    /* Único slot ainda sem foto: placeholder graphite na proporção certa. */
    midia: { tipo: "imagem", src: "/faixa/placeholder-5.svg" },
    classeColuna: "mt-[110vh] max-[480px]:mt-[100rem]",
    classeWrap: "aspect-[213/266]",
    velocidade: 9,
    escondeMobile: true,
  },
  {
    midia: { tipo: "imagem", src: "/faixa/interior-obra.jpg" },
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
      /* Telefone ainda sem definição — literal, não inventar. */
      { texto: "(em definição)" },
      { texto: "contato@imperioconstrutora.com.br", href: "mailto:contato@imperioconstrutora.com.br" },
      { texto: "Guarulhos, SP" },
    ],
  },
];
