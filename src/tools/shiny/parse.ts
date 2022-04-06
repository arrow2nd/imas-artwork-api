import type { Element } from "../../deps.ts";

import { DevCDList } from "../libs/dev_cd_list.ts";

/**
 * リンク要素をパースする
 * @param aElm aタグ
 */
export function parseLinkElement(aElm: Element) {
  const cdList = new DevCDList("shiny");
  const errOut = aElm.innerHTML;

  // 詳細ページのリンクを抽出
  const pageUrl = aElm.getAttribute("href");
  if (!pageUrl) {
    throw new Error(`詳細ページのリンクが抽出できませんでした (${errOut})`);
  }

  // IDを抽出
  const cdId = pageUrl?.match(/(L[A-Z]{2,3}-[^/]+)\/?$/i)?.[1].toUpperCase();
  if (!cdId) {
    console.log(`[SKIP] IDが抽出できませんでした (${pageUrl})`);
    return;
  }

  // 重複を確認
  if (cdList.searchById(cdId)) {
    console.log(`[SKIP] 既に登録されています (${pageUrl})`);
    return;
  }

  // タイトルを抽出
  const title = aElm.getAttribute("title");
  if (!title) {
    throw new Error(`タイトルが抽出できませんでした (${errOut})`);
  }

  // アートワークを抽出
  const artworkUrl = aElm.querySelector("img")?.getAttribute("src");

  if (artworkUrl?.includes("nowprinting")) {
    console.log(`[SKIP] アートワークがまだありません (${errOut})`);
    return;
  } else if (!artworkUrl) {
    throw new Error(`アートワークが見つかりませんでした (${errOut})`);
  }

  // 追加して保存
  cdList.add({
    id: cdId,
    title: title || "",
    page: pageUrl,
    artwork: artworkUrl || "",
  });
}
