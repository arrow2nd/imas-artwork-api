import { fetchHtml } from "../libs/fetch.ts";

import { scrapeCdPage } from "./cd_page.ts";

const baseUrl = "https://columbia.jp/idolmaster/";
const { doc } = await fetchHtml(baseUrl + "index.html");

// ジャケットリンクを抽出
const jacketLinks = [...doc.querySelectorAll(".jacketLink")].map((e) =>
  e.parentElement?.getAttribute("href")
);

console.log(`[OK] ジャケットリンク取得完了 (${jacketLinks.length} 件)`);

// 各ページに対して処理
for (const link of jacketLinks) {
  if (typeof link !== "string") continue;

  const pageUrl = new URL(link, baseUrl).href;
  await scrapeCdPage(pageUrl);
}

console.log(`[SUCCESS]`);
