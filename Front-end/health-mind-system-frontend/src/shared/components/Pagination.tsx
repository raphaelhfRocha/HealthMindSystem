import { useEffect, useMemo, useState } from "react";

export const DEFAULT_PAGE_SIZE = 3;

interface UsePaginationResult<T> {
  /** Itens da página atual. */
  pageItems: T[];
  /** Página atual (1-based, já validada). */
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
  total: number;
  pageSize: number;
  /** Índice (1-based) do primeiro item exibido na página atual. */
  rangeStart: number;
  /** Índice (1-based) do último item exibido na página atual. */
  rangeEnd: number;
}

/**
 * Hook de paginação client-side.
 *
 * @param items   Lista completa (já filtrada/ordenada) a ser paginada.
 * @param pageSize Quantidade de itens por página.
 * @param resetKey Quando muda, volta para a primeira página (ex.: termo de busca).
 */
export function usePagination<T>(
  items: T[],
  pageSize: number = DEFAULT_PAGE_SIZE,
  resetKey?: unknown,
): UsePaginationResult<T> {
  const [page, setPage] = useState(1);

  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  // Sempre que o filtro/busca muda, volta para a primeira página.
  useEffect(() => {
    setPage(1);
  }, [resetKey]);

  // Garante que a página atual continue válida quando a lista diminui.
  useEffect(() => {
    setPage(prev => Math.min(prev, totalPages));
  }, [totalPages]);

  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;

  const pageItems = useMemo(
    () => items.slice(start, start + pageSize),
    [items, start, pageSize],
  );

  return {
    pageItems,
    page: safePage,
    setPage,
    totalPages,
    total,
    pageSize,
    rangeStart: total === 0 ? 0 : start + 1,
    rangeEnd: Math.min(start + pageSize, total),
  };
}

function buildPageNumbers(page: number, totalPages: number, maxButtons = 5): number[] {
  if (totalPages <= maxButtons) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  let start = Math.max(1, page - Math.floor(maxButtons / 2));
  const end = Math.min(totalPages, start + maxButtons - 1);
  start = Math.max(1, end - maxButtons + 1);

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const navButtonStyle = (disabled: boolean) => ({
  minWidth: "32px",
  height: "32px",
  padding: "0 10px",
  border: "1px solid #dde3f0",
  borderRadius: "8px",
  background: "white",
  color: disabled ? "#c2c8d6" : "#1A4FA3",
  fontSize: "13px",
  fontWeight: 600 as const,
  cursor: disabled ? "not-allowed" : "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

/**
 * Controle de navegação de páginas. Não renderiza nada quando há apenas uma página.
 */
export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = buildPageNumbers(page, totalPages);
  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
      <button
        type="button"
        onClick={() => canPrev && onPageChange(page - 1)}
        disabled={!canPrev}
        style={navButtonStyle(!canPrev)}
        aria-label="Página anterior"
      >
        ‹
      </button>

      {pages[0] > 1 && (
        <span style={{ fontSize: "13px", color: "#aaa", padding: "0 2px" }}>…</span>
      )}

      {pages.map(n => {
        const active = n === page;
        return (
          <button
            key={n}
            type="button"
            onClick={() => onPageChange(n)}
            style={{
              minWidth: "32px",
              height: "32px",
              padding: "0 10px",
              border: active ? "1px solid #1A4FA3" : "1px solid #dde3f0",
              borderRadius: "8px",
              background: active ? "#1A4FA3" : "white",
              color: active ? "white" : "#1A4FA3",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
            aria-current={active ? "page" : undefined}
          >
            {n}
          </button>
        );
      })}

      {pages[pages.length - 1] < totalPages && (
        <span style={{ fontSize: "13px", color: "#aaa", padding: "0 2px" }}>…</span>
      )}

      <button
        type="button"
        onClick={() => canNext && onPageChange(page + 1)}
        disabled={!canNext}
        style={navButtonStyle(!canNext)}
        aria-label="Próxima página"
      >
        ›
      </button>
    </div>
  );
}
