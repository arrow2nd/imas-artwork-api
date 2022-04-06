import { fetchHtml } from "../libs/fetch.ts";

import { scrapeCdPage } from "./cd_page.ts";

const baseUrl = "https://www.lantis.jp/imas/";
const { doc } = await fetchHtml(baseUrl);

// ジャケットリンクを抽出
const jacketLinks = doc
  .getElementsByClassName("dsc_box")
  .map((e) =>
    e.getElementsByTagName("a").map((e) => e.getAttribute("href") || "")
  )
  .flat();

console.log(`[OK] ジャケットリンク取得完了 (${jacketLinks.length} 件)`);

for (const url of jacketLinks) {
  if (typeof url !== "string") continue;

  await scrapeCdPage(baseUrl + url);
}

console.log(`[SUCCESS]`);
