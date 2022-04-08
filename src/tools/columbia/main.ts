import { fetchHtml } from "../../libs/fetch.ts";
import { wait } from "../../libs/util.ts";

import { Artwork } from "../../models/artworks.ts";

import { scrapeCdPage } from "./scrape.ts";

const baseUrl = "https://columbia.jp/idolmaster/";

/**
 * コロムビア系CDのデータを更新
 * @param ids ID配列
 * @returns 新規追加するアートワークデータ
 */
export async function updateColumbia(ids: string[]): Promise<Artwork[]> {
  // メインページを取得
  const res = await fetchHtml(baseUrl + "index.html");
  if (!res) return [];

  // 詳細ページへのリンクを抽出
  const detailPages = [...res.doc.querySelectorAll(".jacketLink")].map((e) =>
    e.parentElement?.getAttribute("href")
  );

  console.log(`[OK] 詳細ページのリンク取得完了 (${detailPages.length} 件)`);

  const newArtworks = [] as Artwork[];

  // 各ページに対して処理
  for (const link of detailPages) {
    if (typeof link !== "string") continue;

    const pageUrl = new URL(link, baseUrl).href;
    const result = await scrapeCdPage(ids, pageUrl);

    if (result) {
      newArtworks.push(result);
    }
  }

  console.log("[SUCCESS: columbia]");

  await wait(5);

  return newArtworks;
}
