import type { Element } from "../../deps.ts";

import { CDList } from "../libs/cd_list.ts";

/**
 * CDの詳細をパースする
 * @param aElm aタグ
 */
export function parseCdInfo(aElm: Element) {
  const cdList = new CDList("shiny");

  const errOut = aElm.innerHTML;

  // ページリンクを抽出
  const pageUrl = aElm.getAttribute("href");
  if (!pageUrl) {
    throw new Error(`ページリンクが抽出できませんでした (${errOut})`);
  }

  // IDを抽出
  const cdId = pageUrl?.match(/(L[A-Z]{2,3}-[^/]+)\/?$/i)?.[1].toUpperCase();
  if (!cdId) {
    throw new Error(`IDが抽出できませんでした (${errOut})`);
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
