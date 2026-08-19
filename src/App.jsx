import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowDownAZ,
  ArrowUpDown,
  ExternalLink,
  Package,
  RefreshCw,
  Search,
  ShoppingBag,
  Trash2,
  WalletCards,
  X,
} from "lucide-react";

const API_URL =
  "https://64a28d62b45881cc0ae55762.mockapi.io/products";

const SORT_OPTIONS = {
  priceAsc: "priceAsc",
  priceDesc: "priceDesc",
  nameAsc: "nameAsc",
};

const money = new Intl.NumberFormat("pl-PL", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function normalizeProduct(product) {
  return {
    ...product,
    name: String(product?.name ?? product?.title ?? "Produkt bez nazwy"),
    price: Number(product?.price ?? 0),
    url: String(product?.url ?? product?.link ?? "#"),
  };
}

function StatCard({ label, value, icon: Icon, accent = "slate" }) {
  const accents = {
    slate: "bg-slate-100 text-slate-700",
    blue: "bg-blue-100 text-blue-700",
    emerald: "bg-emerald-100 text-emerald-700",
    amber: "bg-amber-100 text-amber-700",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
            {value}
          </p>
        </div>
        <div className={`rounded-xl p-3 ${accents[accent]}`}>
          <Icon size={21} />
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product, budget, onDelete }) {
  const withinBudget = Number.isFinite(budget) && budget > 0;
  const affordable = withinBudget && product.price <= budget;
  const overBudget = withinBudget && product.price > budget;

  return (
    <article
      className={[
        "group relative flex h-full flex-col rounded-2xl border p-5 shadow-soft transition",
        "hover:-translate-y-0.5 hover:shadow-lg",
        affordable
          ? "border-emerald-200 bg-emerald-50/60"
          : overBudget
            ? "border-red-200 bg-red-50/60"
            : "border-slate-200 bg-white",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="shrink-0 rounded-xl bg-slate-900 p-3 text-white">
            <ShoppingBag size={19} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Produkt
            </p>
            <h2 className="mt-1 line-clamp-2 font-semibold leading-6 text-slate-900">
              {product.name}
            </h2>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onDelete(product)}
          className="shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-red-100 hover:text-red-600"
          aria-label={`Usuń ${product.name}`}
          title="Usuń produkt"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <div className="mt-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-slate-500">Cena</p>
          <p className="mt-1 text-2xl font-bold text-slate-950">
            {money.format(product.price)} zł
          </p>
        </div>

        {withinBudget && (
          <span
            className={[
              "rounded-full px-3 py-1 text-xs font-semibold",
              affordable
                ? "bg-emerald-100 text-emerald-700"
                : "bg-red-100 text-red-700",
            ].join(" ")}
          >
            {affordable ? "W budżecie" : "Ponad budżet"}
          </span>
        )}
      </div>

      <div className="mt-auto pt-5">
        {product.url && product.url !== "#" ? (
          <a
            href={product.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Przejdź do sklepu
            <ExternalLink size={16} />
          </a>
        ) : (
          <span className="block rounded-xl bg-slate-100 px-4 py-3 text-center text-sm font-medium text-slate-400">
            Brak linku do sklepu
          </span>
        )}
      </div>
    </article>
  );
}

function DeleteModal({ product, deleting, onCancel, onConfirm }) {
  if (!product) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-title"
    >
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-red-100 p-3 text-red-600">
              <AlertTriangle size={22} />
            </div>
            <div>
              <h2 id="delete-title" className="font-bold text-slate-950">
                Usunąć produkt?
              </h2>
              <p className="text-sm text-slate-500">
                Tej operacji nie można cofnąć.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            aria-label="Zamknij"
          >
            <X size={19} />
          </button>
        </div>

        <div className="mt-5 rounded-xl bg-slate-50 p-4">
          <p className="font-medium text-slate-900">{product.name}</p>
          <p className="mt-1 text-sm text-slate-500">
            {money.format(product.price)} zł
          </p>
        </div>

        <p className="mt-5 text-sm text-slate-600">
          Czy na pewno chcesz usunąć produkt z listy?
        </p>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={deleting}
            className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            NIE
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="flex-1 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deleting ? "Usuwanie..." : "TAK, usuń"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState(SORT_OPTIONS.priceAsc);
  const [budget, setBudget] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadProducts = useCallback(async (showRefreshing = false) => {
    try {
      setError("");
      if (showRefreshing) setRefreshing(true);
      else setLoading(true);

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(`Błąd HTTP: ${response.status}`);
      }

      const data = await response.json();
      setProducts(Array.isArray(data) ? data.map(normalizeProduct) : []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Nie udało się pobrać produktów."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const numericBudget = Number.parseFloat(
    String(budget).replace(",", ".")
  );

  const stats = useMemo(() => {
    if (!products.length) {
      return {
        total: 0,
        average: 0,
        cheapest: null,
        mostExpensive: null,
      };
    }

    const total = products.reduce((sum, product) => sum + product.price, 0);

    return {
      total,
      average: total / products.length,
      cheapest: products.reduce((min, product) =>
        product.price < min.price ? product : min
      ),
      mostExpensive: products.reduce((max, product) =>
        product.price > max.price ? product : max
      ),
    };
  }, [products]);

  const visibleProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase("pl-PL");

    const filtered = products.filter((product) =>
      product.name.toLocaleLowerCase("pl-PL").includes(normalizedSearch)
    );

    return [...filtered].sort((a, b) => {
      if (sort === SORT_OPTIONS.priceAsc) return a.price - b.price;
      if (sort === SORT_OPTIONS.priceDesc) return b.price - a.price;

      return a.name.localeCompare(b.name, "pl", {
        sensitivity: "base",
      });
    });
  }, [products, search, sort]);

  async function handleDelete() {
    if (!deleteTarget?.id) return;

    try {
      setDeleting(true);
      setError("");

      const response = await fetch(`${API_URL}/${deleteTarget.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Nie udało się usunąć produktu (HTTP ${response.status}).`);
      }

      // Optimistic UI update + synchronizacja z API.
      setProducts((current) =>
        current.filter((product) => product.id !== deleteTarget.id)
      );
      setDeleteTarget(null);
      await loadProducts(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Nie udało się usunąć produktu."
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                <Package size={14} />
                MockAPI • Products
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Lista produktów
              </h1>
              <p className="mt-2 max-w-2xl text-slate-500">
                Przeglądaj, sortuj i kontroluj produkty względem swojego budżetu.
              </p>
            </div>

            <button
              type="button"
              onClick={() => loadProducts(true)}
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-60"
            >
              <RefreshCw
                size={17}
                className={refreshing ? "animate-spin" : ""}
              />
              Odśwież listę
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Łączna wartość"
            value={`${money.format(stats.total)} zł`}
            icon={WalletCards}
            accent="blue"
          />
          <StatCard
            label="Średnia cena"
            value={`${money.format(stats.average)} zł`}
            icon={ArrowUpDown}
            accent="emerald"
          />
          <StatCard
            label="Najtańszy produkt"
            value={
              stats.cheapest
                ? `${money.format(stats.cheapest.price)} zł`
                : "—"
            }
            icon={ArrowDownAZ}
            accent="amber"
          />
          <StatCard
            label="Najdroższy produkt"
            value={
              stats.mostExpensive
                ? `${money.format(stats.mostExpensive.price)} zł`
                : "—"
            }
            icon={ArrowUpDown}
            accent="slate"
          />
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-soft sm:p-5">
          <div className="grid gap-4 lg:grid-cols-[1fr_220px_220px]">
            <label className="relative block">
              <span className="sr-only">Szukaj produktu</span>
              <Search
                size={19}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                type="search"
                placeholder="Szukaj po nazwie produktu..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100"
              />
            </label>

            <label>
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Sortowanie
              </span>
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
              >
                <option value={SORT_OPTIONS.priceAsc}>Cena: rosnąco</option>
                <option value={SORT_OPTIONS.priceDesc}>Cena: malejąco</option>
                <option value={SORT_OPTIONS.nameAsc}>Alfabetycznie A–Z</option>
              </select>
            </label>

            <label>
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Mój budżet
              </span>
              <div className="relative">
                <input
                  value={budget}
                  onChange={(event) =>
                    setBudget(event.target.value.replace(/[^\d,.]/g, ""))
                  }
                  inputMode="decimal"
                  placeholder="np. 2500"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-12 text-sm font-medium outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                />
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                  zł
                </span>
              </div>
            </label>
          </div>

          {Number.isFinite(numericBudget) && numericBudget > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500">
              <span>
                Budżet:{" "}
                <strong className="text-slate-900">
                  {money.format(numericBudget)} zł
                </strong>
              </span>
              <span className="inline-flex items-center gap-1.5 text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                W budżecie
              </span>
              <span className="inline-flex items-center gap-1.5 text-red-700">
                <span className="h-2 w-2 rounded-full bg-red-500" />
                Ponad budżet
              </span>
            </div>
          )}
        </section>

        {error && (
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertTriangle className="mt-0.5 shrink-0" size={18} />
            <div className="flex-1">
              <p className="font-semibold">Wystąpił problem</p>
              <p className="mt-1">{error}</p>
            </div>
            <button
              type="button"
              onClick={() => loadProducts(true)}
              className="font-semibold underline underline-offset-2"
            >
              Spróbuj ponownie
            </button>
          </div>
        )}

        <div className="mt-8 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-950">Produkty</h2>
            <p className="mt-1 text-sm text-slate-500">
              Wyświetlono {visibleProducts.length} z {products.length}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-64 animate-pulse rounded-2xl bg-slate-200"
              />
            ))}
          </div>
        ) : visibleProducts.length ? (
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visibleProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                budget={numericBudget}
                onDelete={setDeleteTarget}
              />
            ))}
          </div>
        ) : (
          <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <Package className="mx-auto text-slate-300" size={40} />
            <h3 className="mt-4 font-semibold text-slate-900">
              Brak produktów
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              {search
                ? "Nie znaleziono produktu pasującego do wyszukiwania."
                : "API nie zwróciło żadnych produktów."}
            </p>
          </div>
        )}

        <footer className="mt-10 border-t border-slate-200 py-6 text-center text-xs text-slate-400">
          Dane pobierane z MockAPI • React + Vite + Tailwind CSS
        </footer>
      </main>

      <DeleteModal
        product={deleteTarget}
        deleting={deleting}
        onCancel={() => !deleting && setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}