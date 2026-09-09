import { cn } from "@/lib/utils";

/**
 * Tag / Category Pill (DESIGN.md)
 * 8px vertical, 12px horizontal, raio 1440px, 12px peso 400 caixa alta.
 * Claro: texto ink, fundo transparente, borda 1px ash.
 * Escuro: texto bone, borda bone; no hover só o fundo preenche.
 */
export function TagPill({
  children,
  tom = "claro",
}: {
  children: React.ReactNode;
  tom?: "claro" | "escuro";
}) {
  return (
    <li
      className={cn(
        "rounded-pill border px-3 py-2 text-caption uppercase",
        tom === "escuro"
          ? "border-bone text-bone transition-colors hover:bg-bone hover:text-ink"
          : "border-ash text-ink",
      )}
    >
      {children}
    </li>
  );
}
