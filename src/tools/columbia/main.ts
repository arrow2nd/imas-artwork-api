import { fetchHtml } from "../libs/fetch.ts";

import { scrapeCdPage } from "./scrape.ts";

const baseUrl = "https://columbia.jp/idolmaster/";
const { doc } = await fetchHtml(baseUrl + "index.html");

// 詳細ページへのリンクを抽出
const detailPages = [...doc.querySelectorAll(".jacketLink")].map((e) =>
  e.parentElement?.getAttribute("href")
);

console.log(`[OK] 詳細ページのリンク取得完了 (${detailPages.length} 件)`);

// 各ページに対して処理
for (const link of detailPages) {
  if (typeof link !== "string") continue;

  const pageUrl = new URL(link, baseUrl).href;
  await scrapeCdPage(pageUrl);
}

console.log(`[SUCCESS]`);
