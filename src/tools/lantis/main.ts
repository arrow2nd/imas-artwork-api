import type { CDType } from "../../types/cd.ts";

import { fetchHtml } from "../libs/fetch.ts";
import { scrapeCdPage } from "./cd_page.ts";

for (const type of ["million", "sidem"] as CDType[]) {
  const baseUrl = `https://www.lantis.jp/${
    type === "million" ? "imas" : type
  }/`;

  // メインページを取得
  const { doc } = await fetchHtml(baseUrl);

  console.log(`[OK] メインページ取得完了 (${baseUrl})`);

  // ジャケットリンクを抽出
  const jacketLinks = doc
    .getElementsByClassName("dsc_box")
    .map((e) =>
      e.getElementsByTagName("a").map((e) => e.getAttribute("href") || "")
    )
    .flat();

  console.log(`[OK] ジャケットリンク取得完了 (${jacketLinks.length} 件)`);

  // 各ページに対して処理
  for (const pagePath of jacketLinks) {
    if (typeof pagePath !== "string") continue;

    await scrapeCdPage(type, baseUrl, pagePath);
  }
}

console.log(`[SUCCESS]`);
