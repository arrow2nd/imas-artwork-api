import type { Genre } from "../../types/cd.ts";

import { fetchHtml } from "../libs/fetch.ts";

import { scrapeCdPage } from "./scrape.ts";

for (const type of ["million", "sidem"] as Genre[]) {
  const basePath = type === "million" ? "imas" : type;
  const baseUrl = `https://www.lantis.jp/${basePath}/`;

  // メインページを取得
  const { doc } = await fetchHtml(baseUrl);

  console.log(`[OK] メインページ取得完了 (${baseUrl})`);

  // 詳細ページへのリンクを取得
  const detailPages = doc
    .getElementsByClassName("dsc_box")
    .map((e) =>
      e.getElementsByTagName("a").map((e) => e.getAttribute("href") || "")
    )
    .flat();

  console.log(`[OK] 詳細ページへのリンク取得完了 (${detailPages.length} 件)`);

  // 各ページに対して処理
  for (const pagePath of detailPages) {
    if (typeof pagePath !== "string") continue;

    await scrapeCdPage(type, baseUrl, pagePath);
  }
}

console.log(`[SUCCESS]`);
