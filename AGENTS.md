# Império Construtora — site institucional

Landing page única, Next.js App Router + TypeScript + Tailwind v4.
Sem src/. Componentes em /components, conteúdo em /lib/dados.ts.

## O documento que manda
DESIGN.md na raiz é a fonte de verdade. Leia antes de mexer em qualquer
componente. A seção "Desvios" no fim registra onde e por que fugimos dele.

## Regras invioláveis
- Manchete sempre peso 300. Nunca bold, em nenhum tamanho.
- Zero box-shadow em qualquer elemento.
- Card e imagem com canto reto (0px). Raio 1440px só em botão, pill e tag.
- Nunca #ffffff puro. O canvas é bone #FAF8F2.
- Dourado #B79653 SÓ sobre fundo escuro. Sobre o creme, só #8A6D2F.
- Texto sempre alinhado à esquerda.
- Sem container de largura máxima: full-bleed com padding lateral 2rem
  (1rem abaixo de 479px).

## Paleta
bone #FAF8F2 · ink #0A0A0A · graphite #5C5A55 · ash #C4C0B6
gold #B79653 · gold-lt #D4B872 · gold-dk #8A6D2F

## Tipografia
Zodiak (serifada) nas manchetes e nos números. Switzer em todo o resto.
As duas vêm da API do Fontshare — NÃO auto-hospedar, a licença ITF não
permite. Peso 300 e 400 apenas.

## Armadilha do cn()
O tailwind-merge não conhece os tokens do @theme: ele classifica text-caption
como cor e descarta o tamanho quando o cn() recebe também uma cor. Não quebra
build nem lint, só aparece medindo computed style no navegador.
Todo token novo de tamanho ou de família PRECISA ser registrado em
lib/utils.ts, no mesmo commit em que for criado.

## Imagens
As fotos da hero já vêm com o tratamento GRAVADO NO ARQUIVO: escurecimento na
base para o texto ter contraste. NUNCA adicione gradiente, overlay ou filter
por CSS sobre foto — o DESIGN.md proíbe overlay e o contraste já está
resolvido na origem. Se trocar a foto, refaça o tratamento no arquivo e meça
de novo.

Todo tratamento é SCRIPT, nunca edição à mão, e lê de `imperio-originais/`,
fora do repositório:
- `scripts/trata-foto-hero.mjs` — as duas fotos da hero
- `scripts/trata-fotos-faixa.mjs` — toda a mídia da faixa de paralaxe
- `scripts/trata-foto-cta.mjs` — a foto da chamada final

## Mídia da faixa de paralaxe — passa pelo script ANTES do commit
⚠ Toda foto, pôster ou vídeo que for para `public/faixa/` tem de passar por
`scripts/trata-fotos-faixa.mjs` antes de ser commitado. A manchete da faixa lê
por `mix-blend-difference` e some contra meio-tom: mídia sem tratamento põe
texto ilegível num site que está no ar.

- **O alvo é ZERO**, não "melhorar": 0% da área dos glifos da manchete abaixo
  de 3:1, na pior posição de rolagem, nas sete larguras. 8% é reprovado.
- **Slot com ciclo: o alvo vale para CADA QUADRO**, não para o primeiro. E
  "área do glifo" é pixel com cobertura >= 0,95 — medir por diferença bruta põe
  a franja do antialias na conta e devolve 19% a 31% de uma tela que passa.
  Ver o Desvio 10 do DESIGN.md.
- A curva é a do script e é uniforme: `saida = 72*(entrada/255)^0,75`.
- ⚠ Os dois mp4 de hoje já foram re-codificados uma vez (eram WhatsApp 480p).
  Quando chegar filmagem boa, trate O ORIGINAL — nunca re-trate o arquivo do
  repositório.
- `ffmpeg` NÃO é dependência do projeto. Para tratar vídeo, aponte o binário:
  `FFMPEG=<caminho> node scripts/trata-fotos-faixa.mjs`.
- As nove fotos novas da faixa já entraram, tratadas. O branch
  `midia-e-mobile` continua com as versões CRUAS — não mescle: ele
  sobrescreveria as tratadas com as originais.

O porquê, com os números medidos, está no Desvio 9 do DESIGN.md.

## Verificação obrigatória
Toda mudança visual é medida, não estimada:
- contraste em 360, 390, 768, 1440 e 1920 — 4,5:1 para texto normal, 3:1 para
  texto grande e para gráfico não textual (ícone, borda)
- ausência de overflow horizontal nas mesmas larguras
- medir pixels compostos da região renderizada. NÃO redesenhe a imagem num
  canvas com matemática própria de object-fit: isso não reproduz o que o
  navegador desenha e já custou uma rodada inteira de medição inválida
- medir caixas de linha reais via Range.getClientRects, não o retângulo do
  parágrafo, que inclui área vazia
- PESO é `encodedDataLength` (bytes no fio, comprimidos), e a LARGURA vai
  junto do número. `body().length` mede o arquivo descomprimido e dá quase o
  dobro: 785 KB no fio contra 1.513 KB decodificados na mesma home, a 1440px.
  Trocar de métrica entre rodadas já fez o peso parecer dobrar sem nada ter
  entrado. Ver o Desvio 10 do DESIGN.md.

## Trabalho em paralelo
Quando houver duas sessões, cada uma é DONA EXCLUSIVA dos seus arquivos e não
encosta nos da outra. Quem cria token novo é sempre quem for dono de
globals.css e lib/utils.ts naquela rodada.

## Git
Commits em português. Autor GMedeiros-cyber <donboymedeiros@gmail.com>.

## Pendências conhecidas
- ⚠ FORA DO CÓDIGO, E EM DUAS ETAPAS, NESTA ORDEM:

  1. **Tirar o registro A da Hostinger do apex.** `construtoraimperio.com`
     tem DOIS registros A — 216.198.79.1 (Vercel) e 2.57.91.91 (Hostinger).
     Metade das visitas cai no site, a outra metade numa página estacionada.
     Conserto é no registrador.
  2. **Só DEPOIS, configurar na Vercel o redirecionamento 308 do apex para o
     www.** Enquanto o A da Hostinger estiver lá, metade das requisições nem
     chega à Vercel e o redirecionamento não tem como valer.

  ⚠ ATÉ AS DUAS ESTAREM FEITAS, O CANONICAL ESTÁ INCOMPLETO. `URL_DO_SITE`
  aponta para o www, que é o único endereço consistente — mas quem digita o
  apex e cai na Hostinger nunca alcança esse endereço, e o buscador que
  rastrear o apex vê uma página estacionada em vez de um redirecionamento
  para o canônico. O valor do código está certo; o que falta é o DNS e o
  redirecionamento fazerem o apex terminar no www.

  `imperioconstrutora.com.br` é só o domínio do e-mail: devolve 503 e
  certificado inválido. Os números medidos estão no comentário de
  `app/site.ts`.
- Telefone: (11) 92777-9559. Fonte única em `telefone` de lib/dados.ts —
  não escreva o número à mão em nenhum outro arquivo.
- Depoimentos não existem — não gere texto fictício de cliente.
- Fotos das obras vieram de dentro de PDF, em baixa resolução. Serão
  substituídas quando o cliente enviar os originais.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
