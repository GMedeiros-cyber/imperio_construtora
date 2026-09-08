/**
 * Tag / Category Pill (DESIGN.md) — variante default
 * 8px vertical, 12px horizontal, raio 1440px, 12px peso 400 caixa alta.
 * Texto ink, fundo transparente, borda 1px ash.
 */
export function TagPill({ children }: { children: React.ReactNode }) {
  return (
    <li className="rounded-pill border border-ash px-3 py-2 text-caption uppercase text-ink">
      {children}
    </li>
  );
}
