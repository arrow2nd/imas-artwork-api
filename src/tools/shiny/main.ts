import { fetchHtml } from "../../libs/fetch.ts";

import { Artwork } from "../../models/artworks.ts";

import { parseLinkElement } from "./parse.ts";

const baseUrl = "https://shinycolors.lantis.jp/discography/";

/**
 * シャニマスCDのデータを更新
 * @param ids ID配列
 * @returns 新規追加するアートワークデータ
 */
export async function updateShiny(ids: string[]): Promise<Artwork[]> {
  // メインページを取得
  const res = await fetchHtml(baseUrl);
  if (!res) return [];

  console.log(`[OK] メインページ取得完了 (${baseUrl})`);

  // 詳細ページへのリンク要素を抽出
  const aElms = res.doc
    .getElementsByClassName("list")
    .map((e) => e.getElementsByTagName("a"))
    .flat();

  console.log(`[OK] 詳細ページのリンク要素取得完了 (${aElms.length} 件)`);

  const newArtworks = [] as Artwork[];

  // 各要素を解析
  for (const aElm of aElms) {
    const result = parseLinkElement(ids, aElm);

    if (result) {
      newArtworks.push(result);
    }
  }

  console.log(`[SUCCESS: shiny]`);

  return newArtworks;
}
