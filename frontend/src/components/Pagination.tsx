// components/Pagination.tsx
import React from "react";

interface Props {
  page: number;
  setPage: (page: number) => void;
  total: number; // nombre total de pages
}

// 🔧 Fonction utilitaire : génère [1, "...", 5, 6, 7, "...", 20]

function generatePageNumbers(current: number, total: number): (number | string)[] {
  const pages: (number | string)[] = [];

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i);
    return pages;
  }

  const visible = new Set<number>();
  visible.add(1);
  visible.add(total);
  visible.add(current);
  visible.add(current - 1);
  visible.add(current + 1);

  const result: (number | string)[] = [];
  let last = 0;

  for (let i = 1; i <= total; i++) {
    if (visible.has(i)) {
      if (last !== 0 && i - last > 1) result.push("...");
      result.push(i);
      last = i;
    }
  }

  return result;
}

export default React.memo(function Pagination({ page, setPage, total }: Props) {
  if (total <= 1) return null;

  return (
    <div>
    <div className="flex items-center gap-2 mt-6 justify-center flex-wrap">

         
     
      {/* Bouton précédent */}
      <button
        disabled={page <= 1}
        onClick={() => setPage(page - 1)}
        className="px-3 py-1 rounded bg-gray-200 disabled:opacity-40"
      >
        ←
      </button>

      {/* Pages numérotées */}
      {generatePageNumbers(page, total).map((p, idx) =>
        p === "..." ? (
          <span key={idx} className="px-2 text-gray-500">
            …
          </span>
        ) : (
          <button
            key={idx}
            onClick={() => setPage(p as number)}
            className={`px-3 py-1 rounded ${
              page === p
                ? "bg-blue-600 text-white font-bold"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {p}
          </button>
        )
      )}

      {/* Bouton suivant */}
      <button
        disabled={page >= total}
        onClick={() => setPage(page + 1)}
        className="px-3 py-1 rounded bg-gray-200 disabled:opacity-40"
      >
        →
      </button>

       
    </div>
    <div className="flex items-center gap-2 mt-6 justify-center flex-wrap">
     Page {page} / {total}   </div>
     </div>
  );
})