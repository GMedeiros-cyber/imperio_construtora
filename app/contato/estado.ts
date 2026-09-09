/* Tipos, opções e regras de validação do formulário de /contato.

   MORAM AQUI, E NÃO EM actions.ts, POR UMA REGRA DO RUNTIME: num módulo
   marcado com "use server" TODO export precisa ser uma função assíncrona. Um
   objeto exportado de lá — como o ESTADO_INICIAL — não sobrevive à travessia:
   o build passa e, em tempo de execução, o valor chega `undefined` no cliente.

   Este arquivo não tem diretiva nenhuma, então é código comum que servidor e
   cliente importam sem cerimônia.

   ⚠ AS OPÇÕES NÃO ESTÃO EM lib/dados.ts, e é circunstancial: naquela rodada o
   arquivo era de outra sessão e não podia ser tocado. Quando alguém for
   consolidar o conteúdo do site, estas duas listas são candidatas naturais a
   mudar de casa — o resto deste arquivo, não. */

export const opcoesTipoObra = [
  "Varejo e franquias",
  "Escritório",
  "Clínica",
  "Restaurante",
  "Residencial",
  "Galpão e logística",
] as const;

export const opcoesEstagio = [
  "Ainda estudando",
  "Projeto pronto",
  "Obra em andamento",
  "Só quero orçamento",
] as const;

export const consentimento =
  "Autorizo a Império a usar estes dados para responder ao meu contato.";

/* ── O que a interface recebe de volta ──────────────────────────────────────
   `valores` existe para o formulário repovoar os campos depois de um envio
   falho — inclusive SEM JS, onde a página é redesenhada do zero e não sobra
   nada do que foi digitado. Perder o texto de quem escreveu é o pior desfecho
   possível aqui. */
export type ValoresContato = {
  nome: string;
  telefone: string;
  email: string;
  tipoObra: string[];
  estagio: string;
  mensagem: string;
  consentimento: boolean;
};

export type EstadoContato = {
  estado: "inicial" | "erro" | "falha" | "sucesso";
  /* Por campo, para o aria-describedby de cada um. */
  erros: Partial<Record<keyof ValoresContato, string>>;
  /* Frase única do resumo no topo. Nula quando não há o que resumir. */
  resumo: string | null;
  valores: ValoresContato;
};

/* ── A VALIDAÇÃO MORA AQUI, E NÃO NA ACTION ────────────────────────────────

   ⚠ ESTA É A ÚNICA CÓPIA DAS REGRAS, e é o que impede o formulário de aceitar
   na tela o que o servidor recusa. A Server Action chama `validar()`; se um dia
   voltar a existir uma checagem de cliente, ela chama a MESMA função. Escrever
   uma segunda checagem "só para o cliente" é como as duas divergem.

   A validação de servidor É A QUE DECIDE. Um POST direto ignora tudo o que é do
   navegador, e por isso a action valida sempre, sem confiar em nada que venha
   de fora.

   ── Os limites, e o motivo de cada um ──

     nome 2..80        dois caracteres é o menor nome próprio real; 80 cobre
                       nome completo com sobrenomes compostos.
     telefone 10 ou 11 telefone brasileiro depois de limpo: DDD + 8 (fixo) ou
                       DDD + 9 (celular). Não aceitamos +55 porque o campo não
                       pede país; 12 ou 13 dígitos é colagem de outro formato, e
                       é melhor devolver erro do que adivinhar onde cortar.
     mensagem 0..1000  opcional, e o teto existe para o destino não receber um
                       romance colado. */
export const LIMITE_NOME = { min: 2, max: 80 };
export const LIMITE_MENSAGEM = 1000;

/* E-mail: verificação SIMPLES, e é decisão. A regex "completa" do RFC 5322 tem
   centenas de caracteres, rejeita endereços válidos e aceita inválidos — o
   único teste que de fato prova um e-mail é mandar mensagem para ele. Aqui
   basta separar erro de digitação de coisa que não é endereço. */
export const pareceEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export const soDigitos = (v: string) => v.replace(/\D+/g, "");

/* REJEITAR, NÃO NORMALIZAR. Valor de `tipoObra` ou `estagio` fora das listas
   conhecidas vira erro, e não é "ajustado" para o mais parecido. Normalizar
   entrada desconhecida é aceitar que alguém decidiu por nós o que o campo
   significa. */
export function validar(
  valores: ValoresContato,
  opcoes: { tipos: readonly string[]; estagios: readonly string[] },
): EstadoContato["erros"] {
  const erros: EstadoContato["erros"] = {};

  if (
    valores.nome.length < LIMITE_NOME.min ||
    valores.nome.length > LIMITE_NOME.max
  ) {
    erros.nome = `Escreva seu nome, entre ${LIMITE_NOME.min} e ${LIMITE_NOME.max} caracteres.`;
  }

  const digitos = soDigitos(valores.telefone);
  if (digitos.length !== 10 && digitos.length !== 11) {
    erros.telefone = "Informe DDD e número, com 10 ou 11 dígitos.";
  }

  if (!pareceEmail(valores.email)) {
    erros.email = "Informe um e-mail válido, no formato nome@dominio.com.";
  }

  if (valores.tipoObra.length === 0) {
    erros.tipoObra = "Escolha ao menos um tipo de obra.";
  } else if (!valores.tipoObra.every((t) => opcoes.tipos.includes(t))) {
    erros.tipoObra = "Escolha ao menos um tipo de obra.";
  }

  if (!opcoes.estagios.includes(valores.estagio)) {
    erros.estagio = "Diga em que estágio a obra está.";
  }

  if (valores.mensagem.length > LIMITE_MENSAGEM) {
    erros.mensagem = `A mensagem passa de ${LIMITE_MENSAGEM} caracteres.`;
  }

  if (!valores.consentimento) {
    erros.consentimento = "Precisamos da sua autorização para entrar em contato.";
  }

  return erros;
}

/* A frase única do resumo no topo, derivada da contagem de erros. Fica junto da
   validação para os dois caminhos contarem do mesmo jeito. */
export function resumoDeErros(erros: EstadoContato["erros"]): string | null {
  const quantos = Object.keys(erros).length;
  if (quantos === 0) return null;
  return quantos === 1
    ? "Falta corrigir um campo antes de enviar."
    : `Faltam corrigir ${quantos} campos antes de enviar.`;
}

export const ESTADO_INICIAL: EstadoContato = {
  estado: "inicial",
  erros: {},
  resumo: null,
  valores: {
    nome: "",
    telefone: "",
    email: "",
    tipoObra: [],
    estagio: "",
    mensagem: "",
    consentimento: false,
  },
};
