/**
 * Logos dos clientes, para o grid do bloco 9.
 *
 * Os arquivos são PNG com fundo transparente e a marca em SILHUETA ink
 * #0A0A0A. Vêm assim de origem, de propósito: as cores originais (o azul da
 * PETZ, o laranja da Artwalk) brigam com o dourado da marca. Não recolorir e
 * não reintroduzir a cor original — e, pelo mesmo motivo, nenhum filtro de
 * brilho ou inversão no CSS. A silhueta já está resolvida no arquivo.
 *
 * `largura` e `altura` são as medidas reais do PNG, não um palpite: o
 * next/image precisa delas para reservar a caixa e não empurrar o layout.
 * As proporções vão de 6,7:1 (Artwalk) a 0,83:1 (Leovit), então quem limita
 * o tamanho na tela é ora a altura, ora a largura — ver o comentário do
 * logo-cloud.
 */

export type LogoCliente = {
  /* Vira o alt da imagem. É o nome da marca, não "logo da marca": o leitor de
     tela já anuncia que é imagem. */
  nome: string;
  arquivo: string;
  largura: number;
  altura: number;
};

export const logosClientes: LogoCliente[] = [
  { nome: "Adidas", arquivo: "/logos/adidas.png", largura: 204, altura: 135 },
  { nome: "Artwalk", arquivo: "/logos/artwalk.png", largura: 360, altura: 54 },
  { nome: "Leovit", arquivo: "/logos/leovit.png", largura: 110, altura: 133 },
  { nome: "Líquido", arquivo: "/logos/liquido.png", largura: 286, altura: 253 },
  {
    nome: "Magicfeet",
    arquivo: "/logos/magicfeet.png",
    largura: 360,
    altura: 82,
  },
  { nome: "OFOS", arquivo: "/logos/ofos.png", largura: 170, altura: 46 },
  { nome: "PETZ", arquivo: "/logos/petz.png", largura: 360, altura: 194 },
  {
    nome: "Transportadora Videira",
    arquivo: "/logos/videira.png",
    largura: 266,
    altura: 57,
  },
];
