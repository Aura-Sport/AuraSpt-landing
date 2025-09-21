import { writeFileSync } from "fs";
import { SitemapStream, streamToPromise } from "sitemap";

const baseUrl = "https://auraspt.cl/";

const pages = ["/"];

const sitemap = new SitemapStream({ hostname: baseUrl });

async function generateSitemap() {
  pages.forEach((route) => {
    sitemap.write({ url: route, changefreq: "daily", priority: 0.8 });
  });
  sitemap.end();

  const sitemapBuffer = await streamToPromise(sitemap);
  writeFileSync("./public/sitemap.xml", sitemapBuffer.toString());
}

generateSitemap().catch(console.error);