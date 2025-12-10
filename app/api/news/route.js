// app/api/news/route.js
import { NextResponse } from "next/server";

const NEWSAPI_BASE = "https://newsapi.org/v2/top-headlines";
const API_KEY = process.env.NEWSAPI_KEY;

async function fetchHeadlines(params) {
  const url = new URL(NEWSAPI_BASE);
  Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, v));
  url.searchParams.append("apiKey", API_KEY);
  url.searchParams.append("pageSize", "40");
  url.searchParams.append("language", "en");

  const res = await fetch(url.toString(), { next: { revalidate: 60 } });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`NewsAPI error ${res.status}: ${text}`);
  }
  return res.json();
}

function normalizeAndDedupe(articles = []) {
  const seen = new Set();
  return articles
    .filter(a => a && a.url && a.title)
    .filter(a => {
      if (seen.has(a.url)) return false;
      seen.add(a.url);
      return true;
    })
    .map(a => ({
      title: a.title,
      description: a.description || null,
      url: a.url,
      source: a.source?.name || "Unknown",
      publishedAt: a.publishedAt || null,
      image: a.urlToImage || null,
    }))
    .slice(0, 40);
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || ""; // e.g., sports, business
    const country = searchParams.get("country") || ""; // optional

    const params = {};
    if (category) params.category = category;
    if (country) params.country = country;

    const data = await fetchHeadlines(params);
    const articles = normalizeAndDedupe(data.articles || []);

    return NextResponse.json({ articles });
  } catch (err) {
    return NextResponse.json({ error: err.message || "Failed to fetch news" }, { status: 500 });
  }
}
