// app/dashboard/page.js
'use client';

import { useEffect, useState } from "react";
import Link from "next/link";

const CATEGORIES = [
  "business",
  "entertainment",
  "general",
  "health",
  "science",
  "sports",
  "technology",
];

export default function Dashboard() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [preview, setPreview] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch a small preview of top headlines (general)
  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/news?category=general");
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Failed to load preview");
        }
        const json = await res.json();
        if (mounted) setPreview((json.articles || []).slice(0, 6));
      } catch (e) {
        if (mounted) setError(e.message || "Error fetching preview");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Top bar for mobile */}
      <header className="w-full md:hidden flex items-center justify-between px-4 py-3 bg-white shadow">
        <div className="text-lg font-bold" style={{ color: "#1F1F1F" }}>News Dashboard</div>
        <button
          aria-label="Toggle menu"
          onClick={() => setMenuOpen((s) => !s)}
          className="p-2 rounded-md bg-gray-100"
        >
          <svg className="w-5 h-5 text-[#1F1F1F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </header>

      {/* Sidebar */}
      <aside className={`
        ${menuOpen ? "block" : "hidden"} md:block
        md:w-64 w-full md:h-auto h-screen bg-white shadow-md transition-all duration-200 z-20
      `}>
        <div className="p-4 border-b flex items-center justify-between">
          <div className="font-bold text-xl" style={{ color: "#1F1F1F" }}>News</div>
          <button
            onClick={() => setMenuOpen(false)}
            className="md:hidden p-1 rounded hover:bg-gray-100"
            aria-label="Close menu"
          >
            <svg className="w-5 h-5 text-[#1F1F1F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="p-3">
          <div className="px-3 pb-2 text-sm text-gray-500" style={{ color: "#1F1F1F" }}>
            Browse categories
          </div>

          <ul className="mt-2 space-y-1">
            {CATEGORIES.map((cat) => (
              <li key={cat}>
                <Link
                  href={`/news/${cat}`}
                  className="block px-3 py-2 rounded hover:bg-gray-100 text-[#1F1F1F] font-medium"
                >
                  {cat[0].toUpperCase() + cat.slice(1)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl md:text-3xl font-bold" style={{ color: "#1F1F1F" }}>Dashboard</h1>
          <div className="hidden md:flex items-center gap-3">
            <span className="text-sm text-gray-600" style={{ color: "#1F1F1F" }}>Latest headlines</span>
          </div>
        </div>

        {/* News preview area — user-first: clear, scannable, tappable */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3" style={{ color: "#1F1F1F" }}>Top headlines</h2>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1,2,3].map(i => (
                <div key={i} className="animate-pulse bg-white rounded shadow p-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
                  <div className="h-28 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="p-4 bg-red-100 text-red-700 rounded">{error}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {preview.map((a) => (
                <article key={a.url} className="bg-white rounded shadow overflow-hidden flex flex-col">
                  <a href={a.url} target="_blank" rel="noreferrer" className="block">
                    <div className="relative h-40 bg-gray-200">
                      {a.image ? (
                        <img src={a.image} alt={a.title} className="w-full h-full object-cover" loading="lazy"
                          onError={(e) => { e.currentTarget.style.display = "none"; }} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-sm text-gray-500">
                          No image
                        </div>
                      )}
                    </div>

                    <div className="p-3">
                      <h3 className="text-base font-semibold" style={{ color: "#1F1F1F" }}>{a.title}</h3>
                      <p className="text-xs mt-1 text-gray-600" style={{ color: "#1F1F1F" }}>
                        {a.source} • {a.publishedAt ? new Date(a.publishedAt).toLocaleString() : ""}
                      </p>
                    </div>
                  </a>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Quick stats or other news-related details */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded shadow">
            <h3 className="text-lg font-semibold" style={{ color: "#1F1F1F" }}>Latest fetch</h3>
            <p className="mt-2 text-sm" style={{ color: "#1F1F1F" }}>
              This dashboard shows a live preview of top headlines. Click a category to see full coverage grouped by source.
            </p>
          </div>

          <div className="p-4 bg-white rounded shadow">
            <h3 className="text-lg font-semibold" style={{ color: "#1F1F1F" }}>Traffic</h3>
            <p className="mt-2 text-sm" style={{ color: "#1F1F1F" }}>Page views and user metrics will appear here.</p>
          </div>

          <div className="p-4 bg-white rounded shadow">
            <h3 className="text-lg font-semibold" style={{ color: "#1F1F1F" }}>Notes</h3>
            <p className="mt-2 text-sm" style={{ color: "#1F1F1F" }}>
              Use the left menu to browse categories. On mobile tap the hamburger to open the menu.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
