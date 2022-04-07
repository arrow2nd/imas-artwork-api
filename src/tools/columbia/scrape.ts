import { Document, ky } from "../../deps.ts";

import { DevCDList } from "../libs/dev_cd_list.ts";
import { fetchHtml } from "../libs/fetch.ts";
import { wait } from "../libs/util.ts";

/**
 * タイトルを取得
 * @param doc ドキュメント
 * @param cdId CDID
 * @returns CDタイトル
 */
function getTitle(doc: Document, cdId: string): string {
  const fmt = (text: string) => text.replace(/[　 \n]+/g, " ").trim();

  // NOTE: 1ページに複数のCDが掲載されている場合があるので
  // まずそれを確かめて、無い場合はサイトタイトルから抽出する

  const selectors = [
    `.CD#${cdId} > .titleInfo > h1`,
    `.cinderella#${cdId} > .titleInfo > h2`,
    ".cinderella > .titleInfo > h2",
    `.discoTitle#${cdId} > .titleInfo > h2`,
  ];

  for (const selector of selectors) {
    const title = doc.querySelector(selector)?.textContent;
    if (title) return fmt(title);
  }

  // サイトタイトルから抽出
  return fmt(doc.title.replace(/^アイドルマスター\s*[|｜]\s*/, ""));
}

/**
 * コロムビア公式サイトからアートワークを取得
 * @param cdId CDID
 * @returns ジャケットURL
 */
async function fetchArtwork(cdId: string): Promise<string> {
  const url = `https://columbia.jp/prod-info/jacket/${cdId}.jpg`;
  const res = await ky.get(url, { timeout: 5000, throwHttpErrors: false });

  return res.ok ? url : "";
}

/**
 * CD詳細ページをスクレイピング
 * @param pageUrl URL
 */
export async function scrapeCdPage(pageUrl: string) {
  const cdList = new DevCDList("columbia");

  // URLからCDのIDを抽出
  const idMatched = pageUrl.match(/(?<A>(?:CO|XT)\S+)?\.html#?(?<B>CO\S+$)?/);
  const cdId = idMatched?.groups?.B || idMatched?.groups?.A;

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
  const { html, doc } = await fetchHtml(pageUrl);
  await wait(5);

  // タイトルを抽出
  const title = getTitle(doc, cdId);

  // アートワークのURLを抽出
  const imagePath = html.match(
    new RegExp(`\(\(\?\:images\?\|img\)\/${cdId}.\(\?\:jpg\|png\)\)`)
  )?.[1];

  // 見つからない場合、コロムビア公式通販を参照する
  const artworkUrl = imagePath
    ? new URL(imagePath, pageUrl).href
    : await fetchArtwork(cdId);

  if (artworkUrl === "") {
    throw new Error(`アートワークが見つかりませんでした (${pageUrl})`);
  }

  // 追加して保存
  cdList.add({
    id: cdId,
    title,
    website: pageUrl,
    artwork: artworkUrl,
  });
}
