import { fetchHtml } from "../../libs/fetch.ts";

import { Artwork } from "../../models/artworks.ts";

import { scrapeCdPage } from "./scrape.ts";

export async function updateLantis(ids: string[]) {
  const addArtworks = [] as Artwork[];

  for (const path of ["imas", "sidem"]) {
    const baseUrl = `https://www.lantis.jp/${path}/`;

    // メインページを取得
    const res = await fetchHtml(baseUrl);
    if (!res) continue;

    console.log(`[OK] メインページ取得完了 (${baseUrl})`);

    // 詳細ページへのリンクを取得
    const detailPages = res.doc
      .getElementsByClassName("dsc_box")
      .map((e) =>
        e.getElementsByTagName("a").map((e) => e.getAttribute("href") || "")
      )
      .flat();

    console.log(`[OK] 詳細ページへのリンク取得完了 (${detailPages.length} 件)`);

    // 各ページに対して処理
    for (const pagePath of detailPages) {
      if (typeof pagePath !== "string") continue;

      const result = await scrapeCdPage(ids, baseUrl, pagePath);

      if (result) {
        addArtworks.push(result);
      }
    }

    console.log(`[SUCCESS: ${path}]`);
  }

  return addArtworks;
}
