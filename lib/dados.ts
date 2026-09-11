import fundoLargo from "@/public/hero/hero-wide.jpg";
import fundoAlto from "@/public/hero/hero-tall.jpg";
import logoNav from "@/public/hero/logo-imperio-nav.png";

/**
 * Conteúdo da home da Império Construtora.
 * A estrutura dos blocos segue o DESIGN.md — aqui vive só o texto.
 */

/* ── 0. Telefone da empresa ──────────────────────────────────────────── */

/* FONTE ÚNICA DO NÚMERO. Rodapé, menu, /contato e a política leem daqui, e
   nenhum outro arquivo escreve o número à mão — trocar aqui troca em todos.
   Até 2026-09-10 esses mesmos lugares mostravam o marcador de pendência.

   Dois formatos, e cada um tem um uso só: `exibicao` é o que se lê na tela;
   `e164` é de onde sai o link. */
export const telefone = {
  exibicao: "(11) 92777-9559",
  e164: "+5511927779559",
} as const;

/* ⚠ O NÚMERO É LINK DE WHATSAPP, NUNCA DO PROTOCOLO tel. No desktop ele não liga para
   ninguém: abre o diálogo de "abrir aplicativo" do sistema. Todo lugar onde o
   número aparece como link aponta para cá, com target _blank e
   rel "noopener noreferrer". Única exceção: a política de privacidade mostra o
   número como texto puro, sem link — documento jurídico não precisa de um.

   O wa.me quer só dígitos, com o DDI e sem o "+": derivado do mesmo número,
   para o link nunca divergir do telefone exibido. */

/* A conversa abre COM TEXTO ESCRITO. Chegar num campo vazio é o ponto em que
   a pessoa trava e fecha; a primeira frase pronta tira esse atrito e já diz de
   onde ela veio, o que ajuda quem atende.

   ⚠ ESTE TEXTO É SÓ DOS LINKS DIRETOS — rodapé, menu, canais de /contato e
   botão flutuante. O formulário de /contato NÃO passa por aqui: ele entrega
   pela Server Action e não compõe mensagem de WhatsApp nenhuma (ver a seção
   da ENTREGA em app/contato/actions.ts). Se um dia ele voltar a compor, a
   mensagem dele é OUTRA, com os dados de quem preencheu — não esta, e nunca
   as duas concatenadas. */
export const whatsappMensagem =
  "Olá! Vi o site da Império Construtora e tenho interesse em conhecer o trabalho de vocês. Podemos conversar sobre a minha obra?";

export const whatsappUrl = `https://wa.me/${telefone.e164.replace(/\D/g, "")}?text=${encodeURIComponent(whatsappMensagem)}`;

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
  /* A hero não tem frase de apoio: saiu a pedido e não volta. Manchete e
     CTA bastam; o que a empresa faz está no "O que fazemos", logo abaixo. */
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
    /* ⚠ #obras-em-destaque, e nao #obras. O id da secao e esse; enquanto o
       dado dizia "#obras" o item existia no menu e nao levava a lugar nenhum
       — a URL mudava e a pagina ficava em y=0. Conferido contra os ids reais
       da home: inicio, obras-em-destaque, sobre, como-trabalhamos. */
    { texto: "Obras", href: "#obras-em-destaque" },
    { texto: "Sobre", href: "#sobre" },
    { texto: "Como trabalhamos", href: "#como-trabalhamos" },
    { texto: "Contato", href: "/contato" },
  ],
  contatoRotulo: "CONTATO",
  contatoLinhas: [
    {
      tipo: "email" as const,
      texto: "contato@imperioconstrutora.com.br",
      href: "mailto:contato@imperioconstrutora.com.br",
    },
    { tipo: "telefone" as const, texto: telefone.exibicao, href: whatsappUrl },
    {
      tipo: "instagram" as const,
      texto: "@_construtoraimperio",
      href: "https://www.instagram.com/_construtoraimperio",
    },
    { tipo: "local" as const, texto: "Guarulhos, SP" },
  ] as {
    tipo: "email" | "telefone" | "instagram" | "local";
    texto: string;
    href?: string;
  }[],
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
  /* Caminho solto, não import estático: a foto é escolhida por posição no
     scroll e não passa por nenhum cálculo de layout que precise das medidas
     em tempo de build. As três são quadradas, 828x828. */
  imagem: string;
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
    imagem: "/obras/petz-radial-leste.jpg",
    imagemAlt:
      "Fachada da loja Petz na Radial Leste, em São Paulo, com o estacionamento em primeiro plano.",
    tags: ["Reforma", "Radial Leste", "Gesso e pintura", "60 dias"],
  },
  /* A Transportadora Videira saiu daqui e ficou só na lista completa de obras,
     mais abaixo: o scroll horizontal mostra três lojas entregues, e o galpão
     não tem foto que sustente o painel. O registro dela continua no arquivo. */
  {
    rotulo: "OBRA 03",
    titulo: "Restaurante Boali",
    descricao:
      "Execução de toda a reforma da loja em modelo turnkey, com noventa dias de obra.",
    imagem: "/obras/boali-restaurante.jpg",
    imagemAlt:
      "Fachada do restaurante Boali, com letreiro laranja, balcão de atendimento e painel decorativo em giz.",
    tags: ["Reforma", "Turnkey", "90 dias"],
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
  /** Velocidade do deslocamento; vira yPercent = velocidade * -50 no desktop
   *  e * -12 abaixo de 768px, onde a coluna é 2,2x mais larga. */
  velocidade: number;
  /** Some abaixo de 768px. Só o slot sem foto real: no mobile são 5 mídias. */
  escondeMobile?: boolean;
};

/* ── A vertente de duas colunas abaixo de 768px ──────────────────────────
   Até 767px as colunas deixam de ser quatro de 77px e viram DUAS de ~44vw,
   posicionadas em absoluto dentro da trilha (que passa a medir 400vw). Os
   topos estão em vw, e não em rem, porque a altura de cada mídia vem da
   proporção sobre a largura da coluna: em rem a composição se desmontava a
   767px, onde a mídia mede o dobro da de 390px.

   Medido antes, a 390px: 2,34% da tela em mídia, 25% das posições sem mídia
   nenhuma, e os últimos 1.094px da trilha só com texto. A geometria de seis
   colunas de 215px espremida em quatro de 77px limitava a cobertura a 9,9%
   mesmo com tudo na tela ao mesmo tempo.

   O -12 do yPercent (contra -50 do desktop) é o que mantém a mídia em cena:
   com -50 as colunas rápidas saíam pelo topo em um quarto do percurso.

   As classes continuam escritas por extenso em cada slot, e não montadas a
   partir de constantes: o Tailwind lê o arquivo como texto. */

export const colunasParalaxe: ColunaParalaxe[] = [
  {
    midia: {
      tipo: "video",
      src: "/faixa/obra-video-2.mp4",
      poster: "/faixa/obra-video-2-poster.jpg",
    },
    classeColuna:
      "mt-[100vh] max-[768px]:absolute max-[768px]:left-0 max-[768px]:top-[30vw] max-[768px]:w-[calc(50%_-_8.5px)]",
    classeWrap: "aspect-[213/352]",
    velocidade: 10,
  },
  {
    midia: {
      tipo: "video",
      src: "/faixa/obra-video-1.mp4",
      poster: "/faixa/obra-video-1-poster.jpg",
    },
    classeColuna:
      "mt-[50vh] max-[768px]:absolute max-[768px]:left-[calc(50%_+_8.5px)] max-[768px]:top-[60vw] max-[768px]:w-[calc(50%_-_8.5px)]",
    classeWrap: "aspect-[213/435]",
    velocidade: 7,
  },
  {
    midia: { tipo: "imagem", src: "/faixa/casa-em-obra.jpg" },
    classeColuna:
      "mt-[130vh] max-[768px]:absolute max-[768px]:left-0 max-[768px]:top-[180vw] max-[768px]:w-[calc(50%_-_8.5px)]",
    classeWrap: "aspect-[213/261]",
    velocidade: 12,
  },
  {
    midia: { tipo: "imagem", src: "/faixa/analia-franco.jpg" },
    classeColuna:
      "mt-[80vh] max-[768px]:absolute max-[768px]:left-[calc(50%_+_8.5px)] max-[768px]:top-[230vw] max-[768px]:w-[calc(50%_-_8.5px)]",
    classeWrap: "aspect-[213/132]",
    velocidade: 5,
  },
  {
    /* Único slot ainda sem foto: placeholder graphite na proporção certa. */
    midia: { tipo: "imagem", src: "/faixa/placeholder-5.svg" },
    classeColuna: "mt-[110vh]",
    classeWrap: "aspect-[213/266]",
    velocidade: 9,
    escondeMobile: true,
  },
  {
    midia: { tipo: "imagem", src: "/faixa/interior-obra.jpg" },
    classeColuna:
      "mt-[80vh] max-[768px]:absolute max-[768px]:left-0 max-[768px]:top-[330vw] max-[768px]:w-[calc(50%_-_8.5px)]",
    classeWrap: "aspect-[213/287]",
    velocidade: 6.5,
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

/* Os arrays obrasEntregues e participacaoTecnica saíram junto com as seções
   que os liam. O tipo Obra fica: components/obras-grid.tsx ainda o importa.
   Esse componente ficou órfão na mesma rodada — só era usado pelas duas
   seções removidas — mas não é meu para apagar. */

/* ── 8. Como trabalhamos ─────────────────────────────────────────────── */

export const comoTrabalhamos = {
  eyebrow: "COMO TRABALHAMOS",
  /* Duas linhas fixas: a quebra é da copy, não do acaso da largura. */
  manchete: ["Quatro formas de contratar.", "Uma só responsabilidade técnica."],
  subline:
    "Executamos obra própria e também atuamos como braço técnico de outras construtoras. Nos dois casos, a engenharia, o cronograma e o controle de qualidade são nossos.",
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

/* Painéis da galeria de autoria.

   A CATEGORIA é a construtora responsável, e é ela que resolve a atribuição
   sem precisar de um rótulo de aviso: quem lê vê de quem é a obra ao lado do
   nome dela. Nenhuma destas cinco é obra própria da Império — em todas a
   atuação foi técnica, em campo. */
export type PainelAutoria = {
  numero: string;
  categoria: string;
  titulo: string;
  imagem: string;
  alt: string;
};

export const galeriaAutoria: PainelAutoria[] = [
  {
    numero: "01",
    categoria: "Riformato Construtora",
    titulo: "Residencial Bella Pietra",
    imagem: "/obras/bella-pietra.jpg",
    alt: "Fachada do Residencial Bella Pietra, na Anália Franco.",
  },
  {
    numero: "02",
    categoria: "Riformato Construtora",
    titulo: "Mix Tower Celso Garcia",
    imagem: "/obras/mix-tower-celso-garcia.jpg",
    alt: "Torre Mix Tower na avenida Celso Garcia, bairro do Belém, São Paulo.",
  },
  {
    numero: "03",
    categoria: "Alfa Realty",
    titulo: "AF 377, Moema",
    imagem: "/obras/af-377-moema.jpg",
    alt: "Edifício comercial AF 377, em Moema, São Paulo.",
  },
  {
    numero: "04",
    categoria: "Alfa Realty",
    titulo: "i9 Tolle, Santana",
    imagem: "/obras/alfa-realty-guarulhos.jpg",
    alt: "Edifício i9 Tolle, em Santana, São Paulo.",
  },
  {
    numero: "05",
    categoria: "Riformato Construtora",
    titulo: "Residencial São Marinho",
    imagem: "/obras/sao-marinho.jpg",
    alt: "Fachada do Residencial São Marinho.",
  },
];

/* ── 9. Marcas ───────────────────────────────────────────────────────── */

/* A faixa subiu para logo abaixo da hero e virou escura. Ali ela é prova
   social, não seção de conteúdo: o eyebrow saiu e o statement passou a ser uma
   linha de apoio miúda, para não disputar com a manchete da hero logo acima.
   O texto é o mesmo — mudou o posto, não a copy. */
export const secaoClientes = {
  statement: "Marcas que confiaram na Império",
} as const;

/* ⚠ ÓRFÃO. Era a lista tipográfica de nomes que a faixa de logos substituiu.
   Fica porque cobre onze clientes e as logos só cobrem oito — três marcas
   (Boali, Authentic Feet, Riformato) existem aqui e não têm arquivo. Antes de
   apagar, decida se elas entram na faixa. */
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

/* ── 9b. Chamada final ───────────────────────────────────────────────── */

/* O último bloco antes do rodapé: o ponto de decisão da página.

   A manchete NÃO é copy nova — é a mesma frase que abre o bloco de contato em
   /contato. Repetir de propósito: quem desce a home inteira e quem chega
   direto na rota de contato lê a mesma pergunta, e a página não inventa
   promessa que o resto do site não faz.

   ⚠ O rótulo do botão diverge dos outros três CTAs do site, que dizem "Falar
   com a Império". Foi pedido assim. Se for para unificar, é aqui que muda. */
export const chamadaFinal = {
  statement: "Conte para nós sobre a sua próxima obra.",
  apoio:
    "Equipe própria, prazo fechado em contrato e orçamento blindado do início ao fim.",
  botao: "Começar aqui",
} as const;

/* ── 10. Contato ─────────────────────────────────────────────────────── */

export const contato = {
  eyebrow: "CONTATO",
  statement: "Conte para nós sobre a sua próxima obra.",
  /* O e-mail ainda é o literal — este objeto não é lido por ninguém desde que
     o bloco virou a rota /contato, que tem a própria lista de canais. */
  linhas: [
    { rotulo: "Telefone", valor: telefone.exibicao },
    { rotulo: "E-mail", valor: "(em definição)" },
    { rotulo: "Local", valor: "São Paulo, SP" },
  ],
  botao: "Falar com a Império",
} as const;

/* ── 11. Rodapé ──────────────────────────────────────────────────────── */

/* Crédito da barra de base. Autor e URL são os MESMOS do rodapé da LDF
   (lib/dados.ts de lá, `creditos`): o perfil do Instagram, e não o domínio. */
export const creditos = {
  autor: "Tribus Labs",
  url: "https://www.instagram.com/tribus__labs/",
} as const;

export type ItemRodape = { texto: string; href?: string };
export type ColunaRodape = { titulo: string; itens: ItemRodape[] };

export const rodape: ColunaRodape[] = [
  {
    titulo: "NAVEGAÇÃO",
    itens: [
      { texto: "Início", href: "#inicio" },
      /* ⚠ #obras-em-destaque, e nao #obras. O id da secao e esse; enquanto o
       dado dizia "#obras" o item existia no menu e nao levava a lugar nenhum
       — a URL mudava e a pagina ficava em y=0. Conferido contra os ids reais
       da home: inicio, obras-em-destaque, sobre, como-trabalhamos. */
    { texto: "Obras", href: "#obras-em-destaque" },
      { texto: "Contato", href: "/contato" },
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
      { texto: telefone.exibicao, href: whatsappUrl },
      { texto: "contato@imperioconstrutora.com.br", href: "mailto:contato@imperioconstrutora.com.br" },
      { texto: "Guarulhos, SP" },
    ],
  },
];
