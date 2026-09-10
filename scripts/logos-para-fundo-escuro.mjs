/**
 * Gera /public/logos/escuro a partir de /public/logos/cor.
 *
 *   node scripts/logos-para-fundo-escuro.mjs
 *
 * As logos dos clientes vivem numa faixa ink com placas em cinza-quase-preto
 * (bone a 10% sobre o ink = rgb(34,34,33)). Tinta ESCURA e NEUTRA morre ali, e
 * tinta com croma nao: laranja, azul e dourado atravessam. Este script separa
 * as duas por pixel e reverte so a primeira para ash #C4C0B6, que e o
 * tratamento padrao de marca monocromatica em fundo escuro.
 *
 * Por isso o simbolo laranja do Boali sobrevive e o wordmark preto dele vira
 * cinza, no mesmo arquivo.
 *
 * ⚠ NAO editar /public/logos/escuro a mao. Mexeu na regra, roda de novo e
 * remede — a tabela de contraste esta em lib/logos.ts.
 *
 * As fontes ficam em /public/logos/cor, aparadas na caixa real da tinta.
 */

import { PNG } from 'pngjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const dir = path.join(raiz, 'public/logos/cor') + path.sep;
const saida = path.join(raiz, 'public/logos/escuro') + path.sep;
fs.mkdirSync(saida, { recursive: true });

const ASH = [196, 192, 182];
const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
const L = (r, g, b) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);

/* Regra: pixel ESCURO e NEUTRO vira ash. Escuro porque é o que some no fundo;
   neutro porque é aí que a tinta é preto de tipografia, e não cor de marca.
   Laranja, azul, dourado e vermelho passam intactos — tem croma. */
for (const f of fs.readdirSync(dir).filter(n => n.endsWith('.png')).sort()) {
  const p = PNG.sync.read(fs.readFileSync(dir + f));
  let trocados = 0, mantidos = 0;
  for (let i = 0; i < p.data.length; i += 4) {
    if (p.data[i + 3] === 0) continue;
    const r = p.data[i], g = p.data[i + 1], b = p.data[i + 2];
    const croma = Math.max(r, g, b) - Math.min(r, g, b);
    /* A Videira e wordmark de UMA cor so, num vinho escuro que morre em
       qualquer superficie escura: mede 1,87:1 sobre a placa, com 99% da tinta
       reprovando, e escurecer ou clarear a placa so piora. Marca monocromatica
       em fundo escuro se reverte — e o que adidas, Authentic Feet e magicfeet
       ja fazem aqui. Por isso ela ignora o corte de croma. */
    const soLuminancia = f === 'videira.png';
    if (L(r, g, b) < 0.15 && (soLuminancia || croma < 40)) {
      p.data[i] = ASH[0]; p.data[i + 1] = ASH[1]; p.data[i + 2] = ASH[2];
      trocados++;
    } else mantidos++;
  }
  fs.writeFileSync(path.join(saida, f), PNG.sync.write(p));
  const total = trocados + mantidos;
  console.log(`${f.padEnd(20)} ${(100 * trocados / total).toFixed(0)}% da tinta virou cinza, ${(100 * mantidos / total).toFixed(0)}% manteve a cor`);
}
