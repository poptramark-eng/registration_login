// app/sports/page.js
'use client';

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

function formatDate(iso) {
  try { return iso ? new Date(iso).toLocaleString() : ""; } catch { return ""; }
}

export default function SportsPage() {
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/news?category=sports");
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Failed to load sports");
        }
        const json = await res.json();
        if (mounted) setArticles(json.articles || []);
      } catch (e) {
        if (mounted) setError(e.message || "Error fetching sports");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  const grouped = useMemo(() => {
    const map = new Map();
    for (const a of articles) {
      const s = (a.source || "Unknown").trim() || "Unknown";
      if (!map.has(s)) map.set(s, []);
      map.get(s).push(a);
    }
    return Array.from(map.entries()).map(([source, items]) => ({ source, items }));
  }, [articles]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: "#1F1F1F" }}>Sports</h1>
            <p className="mt-1 text-sm" style={{ color: "#1F1F1F" }}>Grouped by source — tap a headline to visit the original article.</p>
          </div>
          <Link href="/dashboard" className="text-sm font-medium" style={{ color: "#1F1F1F" }}>Back</Link>
        </div>

        {loading && (
          <div className="space-y-4">
            {[1,2,3].map(i => (
              <div key={i} className="animate-pulse bg-white rounded shadow p-4">
                <div className="h-5 bg-gray-200 rounded w-2/3 mb-3" />
                <div className="h-36 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        )}

        {error && <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

        {!loading && !error && (
          <>
            {grouped.length === 0 ? (
              <div className="p-6 bg-white rounded shadow text-center">
                <p className="text-gray-600" style={{ color: "#1F1F1F" }}>No sports headlines available.</p>
              </div>
            ) : (
              <div className="space-y-8">
                {grouped.map(({ source, items }) => (
                  <section key={source}>
                    <h2 className="text-xl font-semibold mb-3" style={{ color: "#1F1F1F" }}>
                      {source} <span className="text-sm text-gray-500">({items.length})</span>
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {items.map((a) => (
                        <article key={a.url} className="bg-white rounded shadow overflow-hidden flex flex-col">
                          <a href={a.url} target="_blank" rel="noreferrer" className="block">
                            <div className="relative h-40 sm:h-44 bg-gray-200">
                              {a.image ? (
                                <img src={a.image} alt={a.title || "Article image"} className="w-full h-full object-cover" loading="lazy"
                                  onError={(e) => { e.currentTarget.style.display = "none"; }} />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-sm text-gray-500">No image</div>
                              )}
                            </div>

                            <div className="p-3">
                              <h3 className="text-base sm:text-lg font-semibold" style={{ color: "#1F1F1F" }}>
                                <a href={a.url} target="_blank" rel="noreferrer" className="hover:underline">{a.title}</a>
                              </h3>

                              <p className="text-xs sm:text-sm mt-1" style={{ color: "#1F1F1F" }}>
                                {formatDate(a.publishedAt)}
                              </p>

                              {a.description && <p className="mt-2 text-sm" style={{ color: "#1F1F1F" }}>{a.description}</p>}
                            </div>
                          </a>

                          <div className="p-3 mt-auto flex items-center justify-between">
                            <a href={a.url} target="_blank" rel="noreferrer" className="text-sm px-3 py-1 rounded bg-[#1F1F1F] text-white">
                              Visit Source
                            </a>
                            <span className="text-xs text-gray-500">{source}</span>
                          </div>
                        </article>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
