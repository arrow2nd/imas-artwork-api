import type { Element } from "deno-dom-wasm";

import { Artwork } from "../../models/artworks.ts";

/**
 * リンク要素をパースする
 * @param ids ID配列
 * @param aElm aタグ
 * @returns アートワークデータ
 */
export function parseLinkElement(
  ids: string[],
  aElm: Element,
): Artwork | undefined {
  const errOut = aElm.innerHTML;

  // 詳細ページのリンクを抽出
  const website = aElm.getAttribute("href");
  if (!website) {
    throw new Error(`詳細ページのリンクが抽出できませんでした (${errOut})`);
  }

  // IDを抽出
  const cdId = website?.match(/(L[A-Z]{2,3}-[^_/]+)/i)?.[1].toUpperCase();
  if (!cdId) {
    console.log(`[SKIP] IDが抽出できませんでした (${website})`);
    return;
  }

  // 重複を確認
  if (ids.find((id) => id === cdId)) return;

  // タイトルを抽出
  const title: string | undefined = aElm.getAttribute("title");
  if (!title) {
    throw new Error(`タイトルが抽出できませんでした (${errOut})`);
  }

  // アートワークを抽出
  const image = aElm.querySelector("img")?.getAttribute("src");

  if (image?.includes("nowprinting")) {
    console.log(`[SKIP] アートワークがまだありません (${errOut})`);
    return;
  } else if (!image) {
    throw new Error(`アートワークが見つかりませんでした (${errOut})`);
  }

  // アートワークデータを作成
  const artwork = Artwork.create({
    _id: cdId,
    title,
    website,
    image,
  });

  artwork.debugLog();

  return artwork;
}
