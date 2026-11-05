import type { APIRoute } from "astro";
import { SITE_URL } from "../config/site";
import { getPublishedInsights, insightSlug } from "../lib/insights";

// Collect static public pages automatically. New .astro pages are discovered
// at build time; drafts and private areas are never included.
const pageFiles = Object.keys(import.meta.glob("./**/*.astro"));
const nonPublicSections = new Set([
  "admin", "auth", "account", "dashboard", "login", "preview",
  "private", "staging", "api"
]);
function isPublicPath(path: string) {
  const parts = path.split("/").filter(Boolean);
  return !parts.some((part) => nonPublicSections.has(part) || part.startsWith("_"));
}
function fileToPath(file: string): string | null {
  let path = file.replace(/^\.\//, "").replace(/\.astro$/, "");
  if (path.includes("[") || path.includes("]")) return null;
  if (path === "index") return "/";
  path = path.replace(/\/index$/, "");
  return "/" + path;
}
function xmlEscape(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
export const prerender = true;
export const GET: APIRoute = async () => {
  const routes = new Set<string>();
  for (const file of pageFiles) {
    const path = fileToPath(file);
    if (path && isPublicPath(path)) routes.add(path);
  }
  const insights = await getPublishedInsights();
  for (const post of insights) {
    const path = `/insights/${encodeURIComponent(insightSlug(post))}`;
    if (isPublicPath(path)) routes.add(path);
  }
  const entries = [...routes].sort((a, b) => a.localeCompare(b))
    .map((path) => `  <url><loc>${xmlEscape(new URL(path, SITE_URL).href)}</loc></url>`);
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join("\n")}\n</urlset>\n`;
  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" }
  });
};
