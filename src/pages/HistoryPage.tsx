import { useHistoryStore } from "../store/useHistoryStore";
import { useState } from "react";
import { useSeoMeta } from "../hooks/useSeoMeta";
import { Link } from "react-router-dom";
import { HistoryFilter } from "../types/meal";
import PageLayout from "../components/common/PageLayout";

const FILTERS: { key: HistoryFilter; label: string }[] = [
  { key: HistoryFilter.All, label: "All" },
  { key: HistoryFilter.Liked, label: "Liked" },
  { key: HistoryFilter.Disliked, label: "Disliked" },
];
const PAGE_SIZE = 10;

function HistoryPage() {
  const history = useHistoryStore((s) => s.history);
  const clearHistory = useHistoryStore((s) => s.clearHistory);
  const [filter, setFilter] = useState<HistoryFilter>("all");
  const [page, setPage] = useState<number>(1);

  useSeoMeta({
    title: "My History — Recipe Recommender",
    description: "Your rated recipes.",
  });

  const filtered = history.filter((e) =>
    filter === "liked" ? e.liked : filter === "disliked" ? !e.liked : true,
  );
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Reset to page 1 when filter changes.
  const changeFilter = (f: HistoryFilter) => {
    setFilter(f);
    setPage(1);
  };

  return (
    <PageLayout title="History">
      {history.length === 0 ? (
        <p className="text-sm text-neutral-400">
          No recipes rated yet.
          <Link to="/" className="text-orange-500 hover:underline">
            Find one →
          </Link>
        </p>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-2">
              {FILTERS.map((f) => (
                <button
                  key={f.key}
                  onClick={() => changeFilter(f.key)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${filter === f.key ? "bg-neutral-800 text-white border-neutral-800" : "border-neutral-200 text-neutral-500 hover:bg-neutral-50"}`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <button
              onClick={clearHistory}
              className="text-xs text-neutral-400 hover:text-red-400 transition-colors"
            >
              Clear all
            </button>
          </div>

          <ul className="space-y-2">
            {paginated.map((e) => (
              <li key={e.id}>
                <Link
                  to={`/recipe/${e.id}`}
                  className="flex gap-3 items-center p-2 rounded-xl hover:bg-white transition-colors group"
                >
                  <img
                    src={e.thumb}
                    alt={e.title}
                    loading="lazy"
                    className="w-12 h-12 rounded-lg object-cover shrink-0 bg-neutral-100"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-700 truncate group-hover:text-orange-500 transition-colors">
                      {e.title}
                    </p>
                    <p className="text-xs text-neutral-400">
                      {e.area} · {e.ingredient}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full shrink-0 ${e.liked ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}
                  >
                    {e.liked ? "Liked" : "Disliked"}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="text-sm text-neutral-500 disabled:opacity-30 hover:text-neutral-800"
              >
                ← Prev
              </button>
              <span className="text-sm text-neutral-400">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="text-sm text-neutral-500 disabled:opacity-30 hover:text-neutral-800"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </PageLayout>
  );
}

export default HistoryPage;
