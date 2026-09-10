/**
 * Logos dos clientes, para o carrossel de marcas logo abaixo da hero.
 *
 * ══ O PROBLEMA, E POR QUE A PLACA RESOLVE ══
 *
 * A faixa é ink e as marcas entram nas cores originais. Pousadas direto no
 * preto, seis das dez sumiam — três delas por serem monocromáticas pretas, que
 * não têm versão clara para dar. Medido, contraste da tinta média sobre o ink:
 *
 *   Artwalk 5,7:1 · PETZ 4,8:1 · Líquido 3,9:1 · Leovit 3,8:1
 *   Boali 2,6:1 · Videira 2,3:1 · OFOS 1,5:1 · Magicfeet 1,2:1
 *   Authentic Feet 1,1:1 · Adidas 1,0:1
 *
 * A saída não foi escolher entre o preto e a cor. O preto virou campo, a marca
 * ganhou uma PLACA um degrau de valor acima dele — bone a 10% sobre o ink, ou
 * rgb(34,34,33) — e a tinta escura e neutra foi revertida para ash. Sobre a
 * placa, medido de novo:
 *
 *   Adidas 8,8:1 · Authentic Feet 8,8:1 · Magicfeet 8,8:1 · Videira 8,8:1
 *   OFOS 8,4:1 · Boali 7,2:1 · Artwalk 4,5:1 · PETZ 3,9:1
 *   Líquido 3,1:1 · Leovit 3,1:1
 *
 * ⚠ A placa e o tratamento são UM PAR. Clarear a placa não salva ninguém: a
 * Videira, por exemplo, PIORA, porque o vinho dela e a placa convergem em
 * valor. Mexeu numa coisa, remeça as dez.
 *
 * ══ OS ARQUIVOS ══
 *
 * /logos/cor    — as originais coloridas, transparentes, APARADAS na caixa real
 *                 da tinta. São a FONTE. A aparagem importa: vinham com margem
 *                 transparente muito desigual (a Artwalk ocupava 445x63 de um
 *                 canvas 500x500), e sem aparar o dimensionamento mede o vazio.
 * /logos/escuro — as de cima com a tinta escura e neutra revertida para ash.
 *                 É o que o carrossel usa. GERADO, não editado à mão:
 *                 `node scripts/logos-para-fundo-escuro.mjs`.
 * /logos        — as silhuetas ink da primeira entrega, quando não havia cor.
 *                 Só servem sobre superfície clara.
 *
 * ⚠ A Riformato Construtora está em `clientes` e não tem arquivo. É a única
 * das onze que falta.
 *
 * ══ ESCALA ÓPTICA ══
 *
 * As proporções vão de 7,06:1 (Artwalk) a 0,84:1 (Leovit), e a densidade de
 * tinta de 0,227 (Boali) a 0,546 (PETZ). Só limitar altura e largura deixaria a
 * PETZ pesando o triplo da Leovit, porque o olho compara ÁREA DE TINTA, não
 * altura. `escala` iguala essa área: saiu de medir largura x altura x densidade
 * de cada uma no tamanho renderizado, com o alvo na mediana e teto em
 * 0,80–1,35 para nenhuma marca ficar caricata. Medida a dispersão no
 * renderizado depois da correção: 1,34x, contra 3,6x sem ela.
 */

export type LogoCliente = {
  /* Vira o alt da imagem. É o nome da marca, não "logo da marca": o leitor de
     tela já anuncia que é imagem. */
  nome: string;
  arquivo: string;
  /* Medidas da caixa APARADA — o next/image usa para reservar espaço. */
  largura: number;
  altura: number;
  /* Correção óptica. Ver o comentário acima. */
  escala: number;
};

export const logosClientes: LogoCliente[] = [
  { nome: "PETZ", arquivo: "/logos/escuro/petz.png", largura: 290, altura: 157, escala: 0.8 },
  { nome: "Artwalk", arquivo: "/logos/escuro/artwalk.png", largura: 445, altura: 63, escala: 0.95 },
  { nome: "Boali", arquivo: "/logos/escuro/boali.png", largura: 639, altura: 145, escala: 1.1 },
  { nome: "Magicfeet", arquivo: "/logos/escuro/magicfeet.png", largura: 566, altura: 129, escala: 1.05 },
  { nome: "Authentic Feet", arquivo: "/logos/escuro/authentic-feet.png", largura: 556, altura: 161, escala: 0.8 },
  { nome: "Adidas", arquivo: "/logos/escuro/adidas.png", largura: 205, altura: 136, escala: 1.06 },
  { nome: "Líquido", arquivo: "/logos/escuro/liquido.png", largura: 258, altura: 229, escala: 1.35 },
  { nome: "OFOS", arquivo: "/logos/escuro/ofos.png", largura: 169, altura: 44, escala: 0.88 },
  { nome: "Leovit", arquivo: "/logos/escuro/leovit.png", largura: 110, altura: 131, escala: 1.35 },
  { nome: "Transportadora Videira", arquivo: "/logos/escuro/videira.png", largura: 266, altura: 55, escala: 0.83 },
];
