import type { Genre } from "../../types/cd.ts";

import { Document } from "../../deps.ts";

import { DevCDList } from "../libs/dev_cd_list.ts";
import { fetchHtml } from "../libs/fetch.ts";
import { wait } from "../libs/util.ts";

/**
 * タイトルを取得
 * @param doc ドキュメント
 * @returns CDタイトル
 */
function getTitle(doc: Document): string | undefined {
  const fmt = (text: string) => {
    return text
      .replace(/(^\S*『.+?』\S*\n|タイトル[:：]|)/g, "")
      .replace(/[　 \n\u00a0]+/g, " ")
      .trim();
  };

  const selectors = [
    ".titles > h2",
    ".titles > .date > h2",
    ".titles > .date > .date > h2",
  ];

  for (const selector of selectors) {
    const title = doc.querySelector(selector)?.textContent;
    if (title) return fmt(title);
  }

  return undefined;
}

/**
 * アートワーク画像のパスを取得
 * @param pageUrl ページURL
 * @param doc ドキュメント
 * @returns ジャケットURL
 */
function getArtworkUrl(pageUrl: string, doc: Document): string | undefined {
  const selectors = [
    ".release_img > img",
    "#release > img",
    ".release_box > p > img",
  ];

  // NOTE: imagePathは相対パスの場合があるので、URLクラスで絶対パスに変換

  for (const selector of selectors) {
    const imagePath = doc.querySelector(selector)?.getAttribute("src");
    if (imagePath) return new URL(imagePath, pageUrl).href;
  }

  return undefined;
}

/**
 * CD詳細ページをスクレイピングする
 * @param genre ジャンル
 * @param baseUrl ベースURL
 * @param pagePath CDページへの相対パス
 */
export async function scrapeCdPage(
  genre: Genre,
  baseUrl: string,
  pagePath: string
) {
  const pageUrl = new URL(pagePath, baseUrl).href;
  const cdList = new DevCDList(genre);

  // URLからIDを抽出
  const cdId = pageUrl.match(/release_(\S+)\.html$/)?.[1];

  if (!cdId) {
    console.log(`[SKIP] IDが抽出できませんでした (${pageUrl})`);
    return;
  }

  // 重複を確認
  if (cdList.searchById(cdId)) {
    console.log(`[SKIP] 既に登録されています (${pageUrl})`);
    return;
  }

  // 詳細ページを取得
  const { doc } = await fetchHtml(pageUrl);
  await wait(5);

  // タイトルを抽出
  const title = getTitle(doc);

  if (!title) {
    throw new Error(`タイトルが抽出できませんでした (${pageUrl})`);
  }

  // アートワークのURLを抽出
  const artworkUrl = getArtworkUrl(pageUrl, doc);

  if (artworkUrl?.includes("nowprinting")) {
    console.log(`[SKIP] アートワークがまだありません (${pageUrl})`);
    return;
  } else if (!artworkUrl) {
    throw new Error(`アートワークが見つかりませんでした (${pageUrl})`);
  }

  // 追加して保存
  cdList.add({
    id: cdId,
    title: title || "",
    website: pageUrl,
    artwork: artworkUrl || "",
  });
}
