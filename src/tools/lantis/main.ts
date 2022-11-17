import { fetchHtml } from "../../libs/fetch.ts";
import { wait } from "../../libs/util.ts";

import { Artwork } from "../../models/artworks.ts";

import { scrapeCdPage } from "./scrape.ts";

/**
 * ランティス系CDのデータを更新
 * @param ids ID配列
 * @returns 新規追加するアートワークデータ
 */
export async function updateLantis(ids: string[]) {
  const newArtworks = [] as Artwork[];

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
        newArtworks.push(result);
      }
    }

    console.log(`[SUCCESS: ${path}]`);

    await wait(5);
  }

  return newArtworks;
}
