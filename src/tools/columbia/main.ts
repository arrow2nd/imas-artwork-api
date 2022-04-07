import { fetchHtml } from "../../libs/fetch.ts";

import { Artwork } from "../../models/artworks.ts";

import { scrapeCdPage } from "./scrape.ts";

const baseUrl = "https://columbia.jp/idolmaster/";

export async function updateColumbia(ids: string[]): Promise<Artwork[]> {
  // メインページを取得
  const res = await fetchHtml(baseUrl + "index.html");
  if (!res) return [];

  // 詳細ページへのリンクを抽出
  const detailPages = [...res.doc.querySelectorAll(".jacketLink")].map((e) =>
    e.parentElement?.getAttribute("href")
  );

  console.log(`[OK] 詳細ページのリンク取得完了 (${detailPages.length} 件)`);

  const addArtworks = [] as Artwork[];

  // 各ページに対して処理
  for (const link of detailPages) {
    if (typeof link !== "string") continue;

    const pageUrl = new URL(link, baseUrl).href;
    const result = await scrapeCdPage(ids, pageUrl);

    if (result) {
      addArtworks.push(result);
    }
  }

  console.log("[SUCCESS: columbia]");

  return addArtworks;
}
