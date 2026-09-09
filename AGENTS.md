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

## Trabalho em paralelo
Quando houver duas sessões, cada uma é DONA EXCLUSIVA dos seus arquivos e não
encosta nos da outra. Quem cria token novo é sempre quem for dono de
globals.css e lib/utils.ts naquela rodada.

## Git
Commits em português. Autor GMedeiros-cyber <donboymedeiros@gmail.com>.

## Pendências conhecidas
- Telefone segue "(em definição)" — não invente.
- Depoimentos não existem — não gere texto fictício de cliente.
- Fotos das obras vieram de dentro de PDF, em baixa resolução. Serão
  substituídas quando o cliente enviar os originais.
