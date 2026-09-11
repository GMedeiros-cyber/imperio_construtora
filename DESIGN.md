# Creative Giants — Style Reference
> oversized editorial poster on cream paper

**Theme:** light

Creative Giants reads like an oversized art-book spread rendered in code: a warm off-white canvas, hairline margins, and display type so large it functions as a poster rather than a heading. The whole system runs on negative space and one weight of light (300) — headlines whisper at 64–84px instead of bolding into shouting, and letter-spacing tightens aggressively (-0.04em) as type grows so the words feel chiseled, not spaced. Chromatic color is rationed into small, saturated hits: vivid magenta, deep teal, powder blue, hot pink, mint, and navy appear as card surfaces or accents, never as background floods. Interactive elements are black-on-cream pills with fully rounded (1440px) radii, and the chrome is almost invisible — a single circular logo mark and a 'Menu' button floating in white space. The visual identity is a production studio's contact sheet: one enormous headline, one full-bleed photograph, one quiet line of meta text. Every other page should follow the same economy.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Bone White | `#fffef7` | `--color-bone-white` | Page canvas, card surfaces, text on dark accents — a warm off-white that replaces pure #ffffff and gives the whole system a paper-like, printed feel |
| Ink Black | `#000000` | `--color-ink-black` | Dark supporting neutral for text, icons, and strong contrast. Do not promote it to the primary CTA color |
| Graphite | `#666666` | `--color-graphite` | Secondary body text, captions, metadata, helper copy — recedes so display type can dominate |
| Ash | `#aaaaaa` | `--color-ash` | Input borders, inactive link color, tertiary dividers — soft structural gray that disappears when not needed |
| Charcoal Scale | `#4d4c4a` | `--color-charcoal-scale` | Mid-neutral for list borders, subtle elevation on the dark gradient track — warm gray, not blue-gray |
| Magenta Bloom | `#8a0467` | `--color-magenta-bloom` | Pink supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Forest Teal | `#03624c` | `--color-forest-teal` | Saturated brand accent for card frames and decorative strokes; pairs with Magenta Bloom for duotone treatments |
| Powder Blue | `#a5c8eb` | `--color-powder-blue` | Soft chromatic accent — card backgrounds, wash backgrounds, muted illustration fill; cools the warm canvas without competing |
| Candy Pink | `#ffacea` | `--color-candy-pink` | Pastel card surface — high-key, used as one-of-many tints in news/article cards; a softer sibling of Magenta Bloom |
| Mint Wash | `#a5ebd6` | `--color-mint-wash` | Pastel card surface — replaces the structural canvas on selected cards; reads as calm, cool, breathable |
| Navy Ink | `#101731` | `--color-navy-ink` | Deep accent card surface and inverted text ground; the only dark field the system uses, applied sparingly as a featured block |
| Signal Yellow | `#ffd001` | `--color-signal-yellow` | Sporadic high-chroma highlight (badges, tag pills, hover state on cards) — used in trace amounts, never as a primary fill |

## Tokens — Typography

### Switzer — Single-family system: weight 300 for all display and headline work (12–84px), weight 400 for body, metadata, and UI controls. The signature choice is using weight 300 at 64–84px — most systems would bold to 700–800 here; Switzer at light preserves the hairline strokes, making the type feel airbrushed onto the cream canvas. Tighter letter-spacing as size grows (-0.04em at 84px, -0.018em at 14px) keeps the counters open without looking spaced-out. · `--font-switzer`
- **Substitute:** Inter (300, 400), Söhne (300, 400), or any geometric humanist sans with a true 300 weight
- **Weights:** 300, 400
- **Sizes:** 12, 14, 16, 18, 20, 34, 54, 64, 84
- **Line height:** 1.00–1.43
- **Letter spacing:** -0.04em at 84px, -0.027em at 64px, -0.023em at 54px, -0.02em at 34px, -0.018em at 20px and below
- **Role:** Single-family system: weight 300 for all display and headline work (12–84px), weight 400 for body, metadata, and UI controls. The signature choice is using weight 300 at 64–84px — most systems would bold to 700–800 here; Switzer at light preserves the hairline strokes, making the type feel airbrushed onto the cream canvas. Tighter letter-spacing as size grows (-0.04em at 84px, -0.018em at 14px) keeps the counters open without looking spaced-out.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.43 | -0.018em | `--text-caption` |
| body-sm | 14px | 1.43 | -0.018em | `--text-body-sm` |
| body | 16px | 1.4 | -0.018em | `--text-body` |
| subheading | 20px | 1.4 | -0.018em | `--text-subheading` |
| heading-sm | 34px | 1.25 | -0.02em | `--text-heading-sm` |
| heading | 54px | 1 | -0.023em | `--text-heading` |
| display | 84px | 1 | -0.04em | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 8px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 16 | 16px | `--spacing-16` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 112 | 112px | `--spacing-112` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 1440px |
| cards | 0px |
| pills | 1440px |
| images | 0px |
| buttons | 1440px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(255, 255, 255, 0.2) 0px 0px 0px 1px` | `--shadow-subtle` |

### Layout

- **Section gap:** 64px
- **Card padding:** 24px
- **Element gap:** 8px

## Components

### Pill Menu Button
**Role:** Primary navigation trigger in the header

Black (#000000) fill, Bone White (#fffef7) text at 16px weight 400, fully rounded at 1440px radius, padding 12px 24px, no border. Sits in the top-right corner with generous whitespace around it — its darkness is the only heavy element on the cream canvas.

### Header Lockup
**Role:** Persistent top chrome

Two-line eyebrow text (12px, weight 400, all caps, Ink Black) reading 'UNIQUE PUBLIC INTERVENTIONS // IMMERSIVE ACTIVATIONS' to the left of a 32px circular logo mark, Menu button floated right. Zero background — the cream page is the header background. ~16px vertical padding, full-bleed.

### Display Poster Headline
**Role:** Hero / section title

84px Switzer weight 300, letter-spacing -0.04em, line-height 1.0, color Ink Black. Occupies the full viewport width minus the page margin. Optionally rendered with a vertical Charcoal-to-Black gradient on warm-cream lettering for a sculptural poster effect. Never wraps above 2 lines.

### Hero Image Band
**Role:** Full-bleed editorial photography

Full-viewport-width image, no border-radius, no shadow. Meta text (location: 12px all-caps) and headline (34px weight 300) sit bottom-left with 32px left padding. Imagery is the hero; UI chrome yields entirely to the photograph.

### Section Title Block
**Role:** In-page section openers

All-caps eyebrow label (12px, weight 400, Graphite) on a single line, followed by a 34–54px weight 300 statement headline. No background, no rules, no decorations — separation is by whitespace alone (48–64px below the eyebrow, 32px below the headline).

### Project / News Card
**Role:** Card grid items for articles and case studies

3-column grid, no card border, no shadow, no radius. Image sits top of card (square or 4:3, sharp corners). Title 18–20px weight 300 in Ink Black sits 16px below the image. Body copy 14px weight 400 in Graphite, 3-line clamp. Optional 1px chromatic accent border (#8a0467 or #03624c) on the image edge for editorial tagging.

### Chromatic Accent Card
**Role:** Variant card surface using the brand accent palette

Uses one of the pastel or saturated tints (#ffacea, #a5ebd6, #a5c8eb, or #101731) as the card surface. Text inverts: Bone White on Navy Ink, Ink Black on pastels. 0px radius, 24–32px padding. Used as the occasional pop in a card grid; never more than one in a row.

### Carousel Arrow Control
**Role:** Next/prev navigation for card carousels

32px circular outline button, 1px Ash (#aaaaaa) border, transparent fill, 16px Ink Black chevron icon centered. No background change on hover — only the border darkens to Ink Black. Floats above the card row at the right edge of the section title.

### Meta Eyebrow
**Role:** Context labels above headlines

12px Switzer weight 400, all caps, letter-spacing 0 (default), color Graphite (#666666). Single line. Used for location, section names, project categories.

### Full-Bleed Footer
**Role:** Page footer

No background fill — same Bone White canvas. Top edge defined by a 1px hairline divider. Multi-column link lists with 14px weight 400 Ink Black text, 8px row-gap. The extreme Charcoal-to-Black linear gradient (rgb(77,76,74) → rgb(0,0,0)) is reserved for any dark footer band variant; never used elsewhere.

### Tag / Category Pill
**Role:** Small editorial labels and filters

8px vertical, 12px horizontal padding, 1440px radius, 12px weight 400 all-caps. Default: Ink Black text, transparent fill, 1px Ash border. Accent variant: Signal Yellow (#ffd001) fill, Ink Black text, no border.

## Do's and Don'ts

### Do
- Set headlines at weight 300 — never bold a Switzer heading, no matter the size.
- Use Bone White (#fffef7) as the only page background. Pure #ffffff breaks the warm paper language.
- Apply the 1440px pill radius to every button, tag, and Menu element — sharp corners are reserved for cards and images only.
- Push display headlines to 64–84px with -0.04em letter-spacing; the negative tracking is what makes the type feel carved, not printed.
- Let full-bleed photographs carry the visual weight. UI chrome should recede — the Menu button and logo are the only non-image elements above the fold.
- Use chromatic accents (#8a0467, #03624c, #a5c8eb) as borders, small fills, and single-card highlights — never flood a section with color.
- Keep section gaps at 48–64px. The cream canvas is the layout's primary structural tool; rules and dividers are secondary.

### Don't
- Don't bold headlines. The 300 weight is the brand — weight 500+ destroys the airbrushed feel.
- Don't use pure #ffffff anywhere. The warm off-white is a signature, not a fallback.
- Don't add shadows. The system's 0px box-shadow signature means elevation comes from color and scale, not depth.
- Don't round card or image corners. 1440px belongs only to interactive elements; editorial surfaces stay sharp.
- Don't fill a CTA with a chromatic color. No action background evidence supports a colored button — all interactive surfaces are black or transparent.
- Don't exceed two lines on a display headline. The 84px treatment is for poster statements, not paragraphs.
- Don't use #0000ee or default link blue. Inherit Ink Black for all text links; never let browser defaults leak in.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#fffef7` | Page background — warm off-white paper tone |
| 1 | Card Tint | `#a5ebd6` | Pastel card variant — replaces canvas on accent cards |
| 1 | Card Tint Pink | `#ffacea` | Pastel card variant — high-key highlight |
| 1 | Card Tint Blue | `#a5c8eb` | Pastel card variant — cool wash |
| 2 | Signal Pop | `#ffd001` | Sporadic yellow accent — badges, hover, single-card highlight |
| 3 | Inverted Field | `#101731` | Dark accent surface for featured blocks; text inverts to Bone White |

## Elevation

The system has no meaningful elevation. The single detected shadow (rgba(255,255,255,0.2) 0px 0px 0px 1px) is a white 1px inner ring, not a drop shadow — it functions as a hairline highlight on dark elements, not as depth. Separation is built entirely from the warm canvas, whitespace, and the rare dark inverted field. Do not add box-shadows to cards, buttons, or modals.

## Imagery

Editorial photography dominates: full-bleed, sharp-cornered, no overlays or rounded masks. Treatment leans toward documentary and atmospheric — wrinkled hands, public installations, candid human subjects — never staged product shots. Imagery is always presented at large scale (full viewport width or card-filling) so the photograph, not the UI, is the design unit. No illustration, no 3D, no product mockups. Iconography is minimal: a single small circular logo mark, outline-only chevrons on carousel controls, and featherweight 1px-stroke UI icons. Density is image-led, with text serving as a quiet annotation layer below or over the photograph.

## Layout

Full-bleed page model: no max-width container, content runs edge-to-edge with consistent left/right padding (16–32px on mobile, 32px+ on desktop). The hero is a single oversized display headline ('CREATIVE GIANTS' at 84px) taking roughly 40% of the viewport, immediately followed by a full-bleed photograph with bottom-left meta + headline overlay. Section rhythm is monolithic: each new section is introduced by a small all-caps eyebrow + 34–54px weight 300 statement, separated by 48–64px of negative space — no alternating dark/light bands except the single inverted Navy Ink accent card. Content is consistently left-aligned; no centered stacks except the hero display headline. The news/case-study area uses a 3-column card grid with a right-floated arrow control cluster. Navigation is a single top header — no sidebar, no sticky elements beyond the header itself. Overall density is spacious and editorial: every section breathes, and whitespace is the primary structural tool.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000000
- background: #fffef7
- border / divider: #aaaaaa
- secondary text: #666666
- accent: #8a0467 (magenta) and #03624c (teal) — borders and small hits only
- pastel card surface: #a5ebd6, #ffacea, or #a5c8eb
- primary action: no distinct CTA color

**3-5 Example Component Prompts**

1. *Hero display headline*: Full-bleed cream (#fffef7) canvas. 'CREATIVE GIANTS' at 84px Switzer weight 300, color #000000, letter-spacing -0.04em, line-height 1.0, left-aligned with 32px left padding. No background, no border. The headline should occupy ~40% of the viewport height.

2. *Pill Menu button*: 16px Switzer weight 400, color #fffef7 on #000000 fill, 1440px border-radius, padding 12px 24px, no border. Float top-right with 32px margin from edges. Sits alone in the header — no other UI chrome competes.

3. *Full-bleed image band with overlay*: Edge-to-edge photograph (no border-radius). Bottom-left overlay: 12px Switzer weight 400 all-caps meta in #fffef7 ('BRIGHTON, UNITED KINGDOM'), 32px below it a 34px weight 300 statement headline in #fffef7. 32px padding from the left and bottom edges.

4. *News / project card*: 3-column grid, no card border, 0px radius. Square image (no radius) sits at top. 16px below: 20px Switzer weight 300 title in #000000. 8px below: 14px weight 400 description in #666666, 3-line clamp. 48px column gap, no row gap (single row).

5. *Pastel accent card*: One card in the grid swaps to surface #a5ebd6 with 24px padding around its content, text in #000000 at 20px weight 300. The remaining two cards stay on the cream canvas. This is the system's only color-rupture moment.

## Similar Brands

- **Pentagram** — Same oversized editorial display headlines, weight-light typography, full-bleed project photography, and minimal navigation chrome on a neutral canvas.
- **Locomotive (locomotive.ca)** — Same 'studio portfolio as art book' treatment — cream canvas, large weight-300 sans-serif statements, sharp-cornered full-bleed imagery, and pill-shaped controls.
- **Resn** — Same full-bleed experimental photography and whisper-weight display type; both agencies treat the homepage as a single oversized canvas rather than a dashboard.
- **B-Reel** — Same single-line display headline, edge-to-edge video/photo hero, and a cream/near-white canvas with rationed chromatic accents.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-bone-white: #fffef7;
  --color-ink-black: #000000;
  --color-graphite: #666666;
  --color-ash: #aaaaaa;
  --color-charcoal-scale: #4d4c4a;
  --color-magenta-bloom: #8a0467;
  --color-forest-teal: #03624c;
  --color-powder-blue: #a5c8eb;
  --color-candy-pink: #ffacea;
  --color-mint-wash: #a5ebd6;
  --color-navy-ink: #101731;
  --color-signal-yellow: #ffd001;

  /* Typography — Font Families */
  --font-switzer: 'Switzer', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.43;
  --tracking-caption: -0.018em;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: -0.018em;
  --text-body: 16px;
  --leading-body: 1.4;
  --tracking-body: -0.018em;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.018em;
  --text-heading-sm: 34px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: -0.02em;
  --text-heading: 54px;
  --leading-heading: 1;
  --tracking-heading: -0.023em;
  --text-display: 84px;
  --leading-display: 1;
  --tracking-display: -0.04em;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-112: 112px;

  /* Layout */
  --section-gap: 64px;
  --card-padding: 24px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-full: 1440px;
  --radius-full-2: 1600px;

  /* Named Radii */
  --radius-tags: 1440px;
  --radius-cards: 0px;
  --radius-pills: 1440px;
  --radius-images: 0px;
  --radius-buttons: 1440px;

  /* Shadows */
  --shadow-subtle: rgba(255, 255, 255, 0.2) 0px 0px 0px 1px;

  /* Surfaces */
  --surface-canvas: #fffef7;
  --surface-card-tint: #a5ebd6;
  --surface-card-tint-pink: #ffacea;
  --surface-card-tint-blue: #a5c8eb;
  --surface-signal-pop: #ffd001;
  --surface-inverted-field: #101731;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-bone-white: #fffef7;
  --color-ink-black: #000000;
  --color-graphite: #666666;
  --color-ash: #aaaaaa;
  --color-charcoal-scale: #4d4c4a;
  --color-magenta-bloom: #8a0467;
  --color-forest-teal: #03624c;
  --color-powder-blue: #a5c8eb;
  --color-candy-pink: #ffacea;
  --color-mint-wash: #a5ebd6;
  --color-navy-ink: #101731;
  --color-signal-yellow: #ffd001;

  /* Typography */
  --font-switzer: 'Switzer', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.43;
  --tracking-caption: -0.018em;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: -0.018em;
  --text-body: 16px;
  --leading-body: 1.4;
  --tracking-body: -0.018em;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.018em;
  --text-heading-sm: 34px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: -0.02em;
  --text-heading: 54px;
  --leading-heading: 1;
  --tracking-heading: -0.023em;
  --text-display: 84px;
  --leading-display: 1;
  --tracking-display: -0.04em;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-112: 112px;

  /* Border Radius */
  --radius-full: 1440px;
  --radius-full-2: 1600px;

  /* Shadows */
  --shadow-subtle: rgba(255, 255, 255, 0.2) 0px 0px 0px 1px;
}
```

---

## Adaptação — Império Construtora

Este documento é a **referência estrutural** (tipografia, espaçamento, raios,
ausência de sombra, regras de layout e os Do's/Don'ts). A **paleta cromática
acima não é usada** no projeto: magenta, teal, rosa, menta, azul e amarelo
foram substituídos integralmente pela paleta da Império.

| Token | Valor | Uso |
|-------|-------|-----|
| `--color-bone` | `#FAF8F2` | canvas creme (fundo padrão da página) |
| `--color-ink` | `#0A0A0A` | texto principal e fundo das seções invertidas |
| `--color-graphite` | `#5C5A55` | texto secundário, legendas, metadados |
| `--color-ash` | `#C4C0B6` | hairlines, bordas de input, divisores |
| `--color-gold` | `#B79653` | dourado da marca — **somente sobre fundo escuro** |
| `--color-gold-lt` | `#D4B872` | hover e detalhes finos sobre fundo escuro |
| `--color-gold-dk` | `#8A6D2F` | único dourado permitido sobre o creme |

**Regra de contraste (não violar):**
- `#B79653` sobre `#FAF8F2` = **2,7:1 — reprova**. Sobre o creme, use `#8A6D2F`.
- `#B79653` sobre `#0A0A0A` = **7,0:1** — este é o uso principal do dourado.

Os tokens vivem em [`app/globals.css`](app/globals.css) dentro do bloco `@theme`
do Tailwind v4.

---

## Desvios

Desvios conscientes do sistema acima, com o motivo e o escopo. Nada entra aqui
sem medição — e nada sai daqui sem medição nova.

**Resolvido e removido:** o gradiente sobre a foto do Hero Image Band, que
existia porque texto creme sobre foto reprovava no contraste WCAG. Os blocos 2
e 3 foram substituídos por uma hero em composição, onde texto e foto ficam lado
a lado e nunca se sobrepõem — medido em 360, 390, 768, 1440 e 1920px, com zero
intersecção entre os pedaços do headline e os slots de imagem. Sem sobreposição
não há o que medir de contraste, e o overlay saiu junto.

### 1. Escala tipográfica responsiva

**A regra:** o DESIGN.md fixa os tamanhos (84px no display, 34–54px nos
statements) sem prever variação por largura de tela.

**O desvio:** os headlines descem na própria escala de tokens em telas
pequenas — display em 34 → 54 → 84px, statements em 34 → 54px.

**O motivo:** a 390px os tamanhos fixos estouram a viewport e produzem scroll
horizontal, quebrando a regra de página full-bleed com padding lateral de
16–32px. Os valores usados são todos da escala existente, e a faixa 34–54px dos
statements é a que o próprio DESIGN.md especifica.

### 2. Token `--text-body-lg` (18px)

O DESIGN.md lista 18px entre os tamanhos da Switzer e pede 18–20px no título do
card, mas a tabela da escala pula de 16px para 20px. O token foi acrescentado
com o tracking dos demais tamanhos de corpo, para as três linhas do bloco de
contato.

### 3. Manchete centrada no carrossel de marcas

**A regra:** o AGENTS.md lista "Texto sempre alinhado à esquerda" entre as
regras invioláveis, e o resto do site cumpre — hero, Section Title Block,
números, cards, rodapé e formulário são todos à esquerda.

**O desvio:** a manchete "Marcas que confiaram na Império", no bloco 9, é
centrada. Só ela.

**O motivo:** foi decisão do cliente, pedida explicitamente. Não há justificativa
de medição por trás — é escolha de composição, e está registrada aqui para não
virar precedente silencioso.

**O escopo:** UMA manchete, em UM bloco. Nenhum outro texto do site centraliza,
e o próximo que aparecer centrado é bug até prova em contrário.

### 4. Um fundo só para o carrossel de marcas e o "O que fazemos"

**A regra:** o DESIGN.md trata separação de seções como respiro — "sem fundo,
sem régua" —, e cada bloco carregava o próprio fundo chapado.

**O desvio:** as duas seções perderam o fundo próprio e passaram a dividir um
fundo único, declarado num invólucro em `app/page.tsx`. São duas camadas: um
bloom diagonal a 170deg, que sai do ink logo abaixo da hero, atravessa o
carrossel aquecendo, passa por `#16130E` aos 30% e `#372F20` aos 55% e chega ao
dourado `#6B6144` no fim; e, por cima dele, um fecho VERTICAL que escurece para
o ink nos últimos 110px, logo abaixo da linha de números.

**O motivo:** medido a 1440px, o fundo do "O que fazemos" terminava entre
`rgb(100,88,64)` e `rgb(117,106,74)` e encostava no `rgb(10,10,10)` do bloco
seguinte — um salto de cerca de 100 por canal, que lia como uma barra dourada
colada numa preta.

Duas tentativas anteriores não resolveram, e vale registrar por quê. Casar as
cores de ponta entre blocos vizinhos derrubou o salto para 6, mas a TEXTURA
continuava denunciando a emenda: o ruído de um bloco começava de supetão, e o
olho lê a borda do grão mesmo quando a cor não muda. Dar ao bloco de obras uma
rampa que recebesse o dourado resolvia o risco, mas transformava o começo dele
numa faixa dourada — trocava um problema por outro.

**Por que o fecho é uma camada à parte, e vertical:** com o retorno ao preto
dentro do próprio gradiente de 170deg, ele chegava na DIAGONAL — a base esquerda
ainda estava dourada enquanto a direita já era preta, e a emenda virava uma
cunha. Medido: `rgb(91,83,59)` na esquerda contra `rgb(16,17,15)` na direita, na
mesma linha. Vertical, a borda de baixo fecha uniforme, de `rgb(13,13,12)` a
`rgb(14,13,12)` na largura inteira. Os 110px são ancorados na borda de baixo, e
não em porcentagem, porque a altura do invólucro varia de 1356 a 1457px entre
breakpoints.

**A saída:** o fundo volta ao preto ANTES da própria borda. Assim a emenda
com a seção de obras é preto contra preto, não há rampa invadindo o bloco
seguinte, e não sobra nada para emendar. Medido depois: 1 por canal entre o
carrossel e o "O que fazemos", 1 entre este e as obras, 0 entre as obras e a
faixa de paralaxe.

**O preço, e a regra que sai disso:** as paradas do gradiente codificam a
proporção de altura entre os dois blocos. Mudar a altura de qualquer um dos
dois desloca onde cada parada cai, e o eyebrow dourado do "O que fazemos" é o
texto mais frágil da página — remedido em 5,44 a 5,95:1 contra 4,5:1 exigidos,
uma folga menor do que os 5,85 a 6,06:1 de antes. Mexeu na altura ou nas
paradas, meça o eyebrow primeiro.

**Detalhe que custou uma rodada:** o grão precisa ser aplicado com
`background-blend-mode: overlay`, e não pintado direto. Overlay preserva
escuros; pintura direta levanta o `#0A0A0A` para `rgb(26,25,25)`, e aí o preto
deixa de ser preto e nasce um degrau contra o bloco seguinte.

### 5. Raio de 14px no formulário de contato

**A regra:** o DESIGN.md manda canto reto em card e imagem, e só permite o raio
de 1440px em botão, pastilha e tag.

**O desvio:** o formulário de `/contato` — e só ele — usa **raio de 14px**
(token `--radius-campo`) nos campos de texto, na área de mensagem, no resumo de
erros e no bloco de confirmação que entra no lugar do formulário.

**O motivo:** o formulário inteiro foi copiado do projeto LDF por decisão de
projeto — componente e classes `.form__*`, valor a valor —, e copiar o
componente inteiro implicava aceitar o raio. Lá o campo é **preenchido**, e com
a caixa preenchida, misturar canto reto com a pastilha arredondada logo abaixo,
no mesmo bloco, fica incoerente — ou tudo macio, ou tudo reto, e a pastilha não
pode ser reta porque a regra do raio 1440px vale para ela.

Campo de formulário também não é card: ele não é superfície editorial, é
controle.

**O escopo:** os quatro elementos acima, dentro de `.form`. Card e imagem
continuam em 0px em todo o site, e nenhum outro controle herda os 14px.

### 6. Cor de erro — `--color-erro` (#D1614A)

**A regra:** a paleta do AGENTS.md não tem cor de estado.

**O desvio:** acréscimo à paleta de **`--color-erro: #D1614A`**, terracota
apagado da família quente do gold. Usado no formulário de `/contato`: borda do
campo inválido, borda das pastilhas de um grupo inválido, borda do resumo de
erros, outline do aceite inválido e texto do motivo.

**Medido:**

- sobre o ink `#0A0A0A`: **5,20:1** — passa como texto e como borda;
- sobre a placa `#222221`: **4,19:1** — passa como borda (3:1), NÃO como texto
  normal. Por isso o texto de erro fica sobre o ink e o do resumo, que mora na
  placa, é bone.

**O escopo:** **só sobre superfície escura**, igual ao gold. Sobre o bone ela
mede 3,58:1 e reprova como texto. Se um dia precisar de erro sobre o creme,
meça e crie o par escuro — não reuse este.

**O motivo de não ser o gold-lt, que a LDF usava:** o gold já é o estado da
pastilha MARCADA neste mesmo formulário. A mesma cor para "escolhido" e
"errado" é ambígua.

**A cor nunca é o único sinal.** Sob deuteranopia terracota e dourado
convergem, então:

- seleção é **preenchimento** (pastilha gold com ink); erro é **borda + texto**;
- todo campo inválido tem o motivo escrito e visível, não só a borda;
- `aria-invalid` no campo e `aria-describedby` apontando para a mensagem, e o
  resumo do topo é `role="alert"` e recebe foco no envio falho.

### 7. Superfície de controle — `--color-placa` (#222221)

**O desvio:** acréscimo à paleta, o fundo dos campos e das pastilhas do
formulário de `/contato`, um degrau acima do ink. Veio com o formulário da LDF.

**O escopo:** ela NÃO é cor de marca e não entra em seção nem em card — é a
placa do controle. Contra a página ink ela mede 1,24:1: quem diz onde o campo
começa é o rótulo acima e o anel de foco em bone, medido em 18,64:1.

A borda do campo existe o tempo todo, transparente em repouso, e só ganha cor
no erro — assim a validação não muda o tamanho da caixa. Nenhum elemento do
formulário usa `box-shadow`.

### 8. Tratamento novo da foto da hero, e a varredura que saiu dela

**A regra:** a manchete da hero é texto grande sobre foto, e texto grande pede
3:1 de contraste. O AGENTS.md proíbe overlay, gradiente e filter por CSS sobre
foto: o contraste se resolve no arquivo.

**O que mudou:** a foto da hero ganhou um **véu uniforme de 0,16** por cima da
rampa da base que já existia, gravado no arquivo por
`scripts/trata-foto-hero.mjs` a partir do original de 7952×5304 (que mora fora
do repositório). E a **varredura dourada do DiaText saiu da manchete**, que
passou a ser bone chapado.

**Por que o véu é uniforme e não uma rampa maior:** o que reprovava não era a
base escura. Medido em pixel composto, por caixa de linha real, o pior ponto
era a **parede clara da garagem, no meio do quadro**, onde a rampa não chega:
o bone dava **2,89:1 a 1440px**. Rampa não resolve meio de foto.

**Medido depois, bone em repouso, nas 7 larguras** (limite 3:1, fonte de 40 a
99px, sempre texto grande):

| largura | 360 | 390 | 414 | 768 | 992 | 1440 | 1920 |
|---|---|---|---|---|---|---|---|
| pior fatia | 4,80 | 4,80 | 4,79 | 4,79 | 4,66 | 4,05 | 5,15 |

**Por que a varredura saiu.** A banda pintava o glifo de #B79653, #D4B872 e
#8A6D2F. Amostrando ~100 quadros dos 3,4s por largura e medindo só as fatias
com o glifo já pintado (a borda de fade passa por 1:1 em qualquer revelação, e
não conta), a pior fatia ficava em **1,12 a 2,08:1** já com o véu de 0,16 — e
em **1,98:1** com a paleta cortada só ao tom mais claro. O par frágil é
**dourado sobre a parede clara**, não o dourado sobre a base escura.

Para a banda fechar 3:1 a foto teria de ir a um véu de **~0,28** (só #D4B872)
ou **~0,41** (dourado cheio), contra os 0,16 que o texto em repouso pede — o
que apaga a fachada, que é o assunto da foto. A varredura é decorativa; a
manchete ser lida não é. Nessa ordem.

`components/ui/dia-text.tsx` fica no repositório sem uso. Trocou a foto da
hero: rode o script, remeça as duas tabelas e só então decida se a banda volta.

### 9. Toda a mídia da faixa de paralaxe escurecida no arquivo

**A regra:** o DESIGN.md e o AGENTS.md proíbem gradiente, overlay e filter por
CSS sobre foto — o contraste se resolve na origem, gravado no arquivo. Esta
seção registra o tratamento da faixa, que faltava.

**O desvio:** as três fotos, os dois pôsteres, os dois vídeos e o placeholder
da faixa passaram por uma curva de tom uniforme, gravada no arquivo:

```
saida = 72 * (entrada / 255) ^ 0,75      scripts/trata-fotos-faixa.mjs
```

**O motivo, medido.** A manchete da faixa lê por `mix-blend-difference`: o
texto composto vale |bone − fundo|. Contra o ink ela mede 17:1, contra branco
20:1 — e contra MEIO-TOM as duas cores convergem e o texto some. Com o bone
`#FAF8F2`, o contraste fica **abaixo de 3:1 para todo fundo com canal entre 85
e 163**. A manchete é sticky e a mídia atravessa a tela inteira, então cada
pixel de cada mídia passa atrás dos glifos em algum ponto da rolagem.

Medido antes (percentual da ÁREA DOS GLIFOS abaixo de 3:1, na pior posição de
rolagem de cada largura; texto grande, exigência 3:1):

| largura | 360 | 390 | 414 | 768 | 992 | 1440 | 1920 |
|---|---|---|---|---|---|---|---|
| antes | 15,3 | 35,4 | 19,9 | — | — | **12,3** | — |
| depois | **0** | **0** | **0** | **0** | **0** | **0** | **0** |

Os 12,3% a 1440px já estavam no ar antes desta rodada: a causa é a mesma, foto
sem tratamento atrás de texto grande. O pior PIXEL de glifo em toda a varredura
— 146 posições de rolagem somando as sete larguras — passou a **3,92:1**.

**Por que 72, e não 84.** 84 é o teto teórico: com todo canal em 84 ou menos, o
texto composto fica em 166 ou mais e o par mede 3,2:1. Só que a compressão com
perda ESTOURA o teto — medido, jpeg e webp devolvem até 95 onde o pixel gravado
era 84, e o h264 a crf 26 devolve até 109. Com teto 72, jpeg de qualidade 88 e
croma 4:4:4, webp 88 e h264 a crf 20, o pixel DECODIFICADO não passa de 0,087
de luminância contra o limite de 0,0887: zero pixels acima.

**Por que uma curva, e não o véu multiplicativo dos outros dois scripts.** A
gama de 0,75 levanta sombra e meio-tom dentro do teto. Com véu puro a
`interior-obra`, que já era escura, caía para média 21 de 255 e virava mancha;
com a curva ela fica em 25 e o vão da janela continua lendo. Médias depois do
tratamento, em 255: analia-franco 47, casa-em-obra 44, interior-obra 25,
pôsteres 52 e 47.

**O placeholder também — e ele já saiu.** `placeholder-5.svg` teve a chapa e OS
RÓTULOS escurecidos (`#5C5A55`→`#222120`, `#FAF8F2`→`#474745`). Os rótulos em
bone eram o único ponto claro dentro da mídia, e toda borda entre claro e escuro
atravessa a faixa de falha no antialias: 0,05% da área dos glifos a 1440px
vinham dali. O arquivo foi apagado de `public/faixa/` no Desvio 10, quando o
slot 5 ganhou a foto da loja; continua em `imperio-originais/faixa` caso algum
slot volte a ficar sem foto.

**O preço, e o que fica de regra.** A faixa ficou nitidamente mais escura: é o
vale escuro entre os dois blooms dourados, e agora ela é isso de fato. As fotos
continuam lendo como fotografia noturna, não como mancha, mas a `interior-obra`
é o caso-limite — se o tratamento tiver de ficar mais forte um dia, ela é a
primeira a quebrar.

**Estas fotos não têm original.** Vieram de dentro de um PDF e de capturas de
story; o que está em `imperio-originais/faixa` é a cópia do que estava
versionado antes do tratamento. Quando o cliente mandar os originais, ponha-os
lá, rode o script e remeça as sete larguras.

#### A REGRA QUE FICA: nenhuma mídia entra na faixa sem passar pelo script

⚠ **Toda foto, pôster ou vídeo que for entrar em `public/faixa/` passa por
`scripts/trata-fotos-faixa.mjs` ANTES de ser commitado.** Não é recomendação: a
manchete sticky atravessa toda a mídia da faixa, e mídia sem tratamento traz o
texto de volta para dentro da zona de falha do `mix-blend-difference` — num site
que está no ar.

Três coisas valem junto com isso:

1. **O alvo é ZERO, não "melhorar".** A medição é o percentual da ÁREA DOS
   GLIFOS da manchete abaixo de 3:1, na pior posição de rolagem de cada uma das
   sete larguras. O critério de aceite é 0% nas sete. "Caiu de 35% para 8%" é
   reprovado.
2. **A curva é a do script, uniforme:** `saida = 72 * (entrada/255)^0,75`, por
   canal, gravada no arquivo. Nada de overlay, gradiente ou filter por CSS —
   nem "só nesta foto".
3. **As nove fotos novas vieram do branch `midia-e-mobile` SEM tratamento** e
   entraram por aqui: foram copiadas para `imperio-originais/faixa`, passaram
   pelo script e só então foram para `public/faixa/`. O branch continua com as
   versões cruas — não mescle aquele branch, ele sobrescreveria as tratadas.

#### ⚠ PESO SE MEDE NO FIO, E O NÚMERO VEM COM A LARGURA COLADA

Duas rodadas reportaram o peso da home com métricas diferentes e o número
pareceu dobrar sem nada ter entrado:

| rodada | o que foi dito | o que era |
|---|---|---|
| vídeo sob demanda (`eb70ecc`) | "784 KB" | **390px**, `encodedDataLength` |
| ciclo na faixa (`16f8166`) | "1.510 KB" | **1440px**, bytes decodificados |

Os dois estavam certos e não se comparavam: larguras diferentes E métricas
diferentes. Medido lado a lado no mesmo build, a 1440px: **785 KB no fio contra
1.513 KB decodificado**. Na mesma métrica da rodada antiga, a home EMAGRECEU —
854 KB para 785 a 1440px, e 784 para 759 a 390px, porque o motor de partículas
saiu do bundle inicial e a mídia da faixa encolheu com o tratamento.

**A regra: peso é `encodedDataLength`, e a largura vai junto do número.**
`(await response.body()).length` mede o arquivo descomprimido e serve para
outra coisa — saber o que o parser vai engolir —, nunca para dizer "a página
pesa X".

#### ⚠ OS DOIS VÍDEOS JÁ PERDERAM DUAS GERAÇÕES

`obra-video-1.mp4` e `obra-video-2.mp4` são arquivos de WhatsApp a 480p — já
comprimidos na origem — e o tratamento os RE-CODIFICOU. São duas gerações de
perda sobre uma resolução que já amplia mais de 2x no celular (a coluna do
mobile mede 171px e o arquivo tem 480px de largura; a 767px em DPR 3 a
ampliação chega a 2,14x). O `crf 20` do script não é desperdício de bytes: é o
que impede a decodificação de estourar o teto de 72 e devolver o texto à zona
de falha.

**Quando a filmagem boa chegar, trate O ORIGINAL.** Ponha o arquivo bruto em
`imperio-originais/faixa/` e rode o script a partir dele. NUNCA re-trate os
mp4 que estão no repositório hoje: seria a terceira geração de perda sobre a
segunda, e o resultado não volta atrás. O mesmo vale para as três fotos.

### 10. Cada slot de foto da faixa vira um ciclo de fotos

**O desvio:** cada coluna de FOTO da faixa de paralaxe deixou de ser uma imagem
parada e passa a alternar entre as fotos daquele assunto, 2s por quadro, com
fusão de 700ms. Não é um slot novo: a coluna, a proporção e a velocidade são as
mesmas, muda o que está dentro dela. Os dois slots de VÍDEO continuam vídeo.

**Por que os vídeos ficam vídeo.** Alternar filme com foto parada no mesmo
retângulo não lê como edição, lê como falha de carregamento: o movimento para
por 2s e volta. Além disso o `<video>` é `loop` e `autoPlay` — escondê-lo por
2s o deixa tocando por trás sem ninguém ver, ou obriga a pausar e retomar, e o
retomar re-busca buffer. E os dois vídeos são o único assunto "obra em
andamento" em movimento que a faixa tem.

**O agrupamento.** Nove fotos entraram; oito são da MESMA residência e uma é a
loja de São Mateus. O assunto de cada slot é o par ANTES/DEPOIS do mesmo tipo de
espaço — é o que a faixa conta:

| slot | proporção | assunto | quadros |
|---|---|---|---|
| 1 | 213/352 | obra em andamento | `obra-video-2` — **vídeo, sem ciclo** |
| 2 | 213/435 | obra em andamento | `obra-video-1` — **vídeo, sem ciclo** |
| 3 | 213/261 | a casa por fora | `casa-em-obra` · `residencia-corredor` · `residencia-fachada-noite` · `residencia-entrada-noite` |
| 4 | 213/132 | quadro largo, área externa | `analia-franco` · `residencia-garagem` · `residencia-fundos` |
| 5 | 213/132 | a loja | `authentic-feet-sao-mateus` — **quadro único** |
| 6 | 213/287 | por dentro | `interior-obra` · `residencia-porta` · `residencia-escada-noite` · `residencia-cozinha` |

**Por que a loja não entra em ciclo.** `authentic-feet-sao-mateus` é outro
cliente e outro tipo de obra. Alternando com a residência, as duas passariam a
ler como a mesma obra. Ela é quadro único — e é ela que tira o
`placeholder-5.svg` do ar, o último slot sem foto real. A proporção do slot 5
mudou de 213/266 para 213/132 por causa dela: a foto é 828x512, paisagem 1,62, e
recortada para os 0,80 da caixa antiga sairia com 410px de largura contra os 430
que a coluna de 215px pede em DPR 2 a 1440px. Mudar a caixa não custa nada
porque o slot 5 é `escondeMobile` — a geometria de duas colunas do celular não
sente.

**A proporção manda na lista.** Todo quadro de um mesmo slot cai na mesma caixa
com `object-cover`: só entram fotos com a proporção do `classeWrap`, ±1%. Foto de
outra proporção não "cabe com um recortinho" — ela perde de 20% a 40% do quadro
e vira outra foto.

**⚠ O ALVO DE 0% VALE PARA CADA QUADRO, NÃO PARA O PRIMEIRO.** A manchete é
sticky e cada quadro atravessa a tela inteira por baixo dela. Medido com cada
quadro forçado na tela, em 9 posições de rolagem por largura, nas sete larguras
— 252 amostras, cada uma com dois prints (com e sem a manchete):

| quadro | 360 | 390 | 414 | 768 | 992 | 1440 | 1920 |
|---|---|---|---|---|---|---|---|
| 1 | 0% | 0% | 0% | 0% | 0% | 0% | 0% |
| 2 | 0% | 0% | 0% | 0% | 0% | 0% | 0% |
| 3 | 0% | 0% | 0% | 0% | 0% | 0% | 0% |
| 4 | 0% | 0% | 0% | 0% | 0% | 0% | 0% |

Pior razão de um pixel de glifo em toda a varredura: **4,78:1** (360px, quadro
4), contra os 3:1 exigidos.

**⚠ ÁREA DO GLIFO É COBERTURA >= 0,95, E NÃO DIFERENÇA BRUTA.** Com
`mix-blend-difference` o pixel vale `fg = bg*(1−a) + |bone−bg|*a`, onde `a` é a
cobertura do glifo naquele pixel. Medindo por diferença bruta, toda a franja do
antialias entra como "área do glifo" — e franja é quase fundo, então ela mede
perto de 1:1 sozinha. Medido nas mesmas amostras: com limiar de diferença bruta,
19% a 31%; com cobertura >= 0,5, de 0,11% a 2,53%; com cobertura >= 0,95, 0%. Os
três números descrevem a mesma tela. **O que conta é a cor que o texto pinta, não
a rampa do antialias** — é o que a WCAG mede.

**⚠ QUEM ESTOURA O TETO É O OTIMIZADOR, NÃO O SCRIPT.** O script grava 72 de
canal máximo. O arquivo que a rede ENTREGA, redimensionado e re-codificado pelo
`/_next/image`, chega a 92. Acima de 84 o texto composto cai de 3:1. Medido na
área de cada arquivo entregue, no pior caso de largura e DPR:

| foto | canal máx | área acima de 84 |
|---|---|---|
| `authentic-feet-sao-mateus` | 90 | 0,0063% |
| `analia-franco` | 92 | 0,0059% |
| `casa-em-obra` | 87 | 0,0022% |
| `residencia-porta` | 90 | 0,0022% |
| `residencia-garagem` | 89 | 0,0012% |
| `residencia-fachada-noite` | 88 | 0,0011% |
| `residencia-fundos` | 85 | 0,0007% |
| `interior-obra` | 88 | 0,0002% |
| as outras quatro | <= 84 | 0% |

São pixels isolados de ringing em borda dura — dezenas de pixels num arquivo de
750x464 — e nenhum deles caiu sob um glifo nas 252 amostras. Não é falha medida,
é a margem que sobrou. Não é novidade desta rodada: `analia-franco` com 92 já
estava no ar. Fechar isso pede baixar o TETO do script de 72 para ~64 e
re-tratar TUDO, vídeos inclusive — e re-tratar vídeo é a terceira geração de
perda que o Desvio 9 proíbe. Fica registrado, não aplicado.

**⚠ RESOLUÇÃO: DUAS FOTOS AMPLIAM, E ENTRAM ASSIM MESMO.** A coluna mede 215px
a 1440px, o que pede 430px de origem em DPR 2. Medido lendo os BYTES que a rede
entregou (`naturalWidth` mente quando o srcset usa descritores `w`):

| foto | origem | 1440/DPR2 (pede 430) | 1920/DPR2 (pede 590) | 390/DPR3 (pede 513) |
|---|---|---|---|---|
| `residencia-corredor` | 400px | amplia 1,07x | amplia 1,48x | amplia 1,28x |
| `residencia-cozinha` | 414px | amplia 1,04x | amplia 1,43x | amplia 1,24x |
| `casa-em-obra` | 469px | 1,09 | amplia 1,26x | amplia 1,09x |
| `residencia-porta` | 488px | 1,13 | amplia 1,21x | 0,95 |
| `residencia-garagem` | 628px | 1,46 | 1,06 | 1,22 |

As duas entram. A 1440px em DPR 2 — o caso que a instrução citou — a ampliação é
de 1,07x e 1,04x, uma ordem de grandeza abaixo do 1,5x que fez a foto do CTA ler
como borrão. O caso ruim é 1920px em DPR 2, onde chega a 1,48x — mas lá
`casa-em-obra`, que já estava no ar, amplia 1,26x pelo mesmo motivo. **Nada foi
ampliado no arquivo para caber.** O conserto é original de verdade, não
`resize`: estas fotos são captura de story.

**O ciclo não disputa com o pin/scrub do GSAP.** Medido rolando a faixa inteira
por `requestAnimationFrame` em 5s, 10 corridas ALTERNADAS com o ciclo rodando e
com os timers mortos (no projeto só a faixa usa `setInterval`):

| 1440px | quadros | perdidos | % |
|---|---|---|---|
| ciclo rodando | 2.966 | 34 | 1,13% |
| ciclo parado | 2.944 | 56 | 1,87% |

A diferença troca de sinal entre baterias — é ruído. A 390px em emulação, 23,5%
contra 23,9%: o custo ali é o scrub, não o ciclo. **Nenhuma pausa durante a
rolagem foi aplicada**, porque não há o que pausar: o timer dispara uma vez a
cada 2s e a transição é de `opacity`, que roda no compositor.

⚠ Uma bateria anterior, com as 5 corridas de A todas antes das 5 de B, deu 2,67%
contra 1,20% e sugeriu contenção. Era deriva da máquina ao longo da bateria.
**Teste A/B de desempenho se mede alternado**, nunca em bloco.

**Pausa e movimento reduzido.** O ciclo só anda com a seção na viewport
(`IntersectionObserver` separado do que libera o vídeo, porque aquele tem uma
tela de antecedência e nunca volta a false). Com `prefers-reduced-motion` não há
ciclo E os quadros 2 em diante nem entram na árvore: medido, sem essa segunda
trava as nove fotos eram baixadas do mesmo jeito por quem nunca as veria.

**Peso da home, produção, sem cache.** ⚠ DUAS MÉTRICAS, e elas diferem por 2x:
`encodedDataLength` é o que passou no fio (comprimido), `body().length` é o
arquivo já descomprimido. Os 265 KB de script no fio são 815 KB decodificados —
brotli, não conteúdo novo. **O número que se compara entre rodadas é o do fio.**

| | antes — fio | depois — fio | antes — decodif. | depois — decodif. |
|---|---|---|---|---|
| 1440 inicial | 784 KB | **785 KB** | 1.510 KB | 1.513 KB |
| 1440 até o fim | 3.025 KB | 3.052 KB | 3.839 KB | 3.865 KB |
| 390 inicial | 758 KB | **759 KB** | 1.484 KB | 1.487 KB |
| 390 até o fim | 2.937 KB | 2.978 KB | 3.752 KB | 3.791 KB |

A carga inicial não mudou — 1 KB, ruído — e não há um único `residencia-*` no
HTML servido. As nove fotos custaram 27 KB a 1440 e 41 KB a 390 no fio, todas
depois de a faixa chegar a uma tela de distância.
