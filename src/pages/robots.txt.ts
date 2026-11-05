import type { APIRoute } from "astro";
import { SITE_URL } from "../config/site";

export const prerender = true;
export const GET: APIRoute = () => {
  // Production pages remain crawlable; Vercel previews stay protected.
  const env = process.env.VERCEL_ENV;
  const isPreview = env !== undefined && env !== "production";
  const body = isPreview
    ? "User-agent: *\nDisallow: /\n"
    : `User-agent: *\nAllow: /\nSitemap: ${SITE_URL}/sitemap.xml\n`;
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" }
  });
};
