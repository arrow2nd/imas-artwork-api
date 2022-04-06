import { CDList } from "../../libs/cd_list.ts";

import { wait } from "../libs/util.ts";
import { fetchHtml } from "../libs/fetch.ts";

import { Document, ky } from "../../deps.ts";

/**
 * タイトルを取得
 * @param doc ドキュメント
 * @param cdId CDID
 * @returns CDタイトル
 */
function getTitle(doc: Document, cdId: string): string {
  const fmt = (text: string) => text.replace(/[　 \n]+/g, " ");

  /**
   * NOTE: 1ページに複数のCDが掲載されている場合があるので
   * まずそれを確かめて、無い場合はサイトタイトルから抽出する
   */

  // 2021/10～の新サイト
  const titleNew = doc.querySelector(
    `.CD#${cdId} > .titleInfo > h1`
  )?.textContent;

  if (titleNew) return fmt(titleNew);

  // 旧サイト（MASTER ARTIST 4 Series）
  const titleMA4 = doc.querySelector(
    `.cinderella#${cdId} > .titleInfo > h2`
  )?.textContent;

  if (titleMA4) return fmt(titleMA4);

  // 一番上のCDタイトル（MASTER ARTIST 4 Series）
  const titleMA4Top = doc.querySelector(
    `.cinderella > .titleInfo > h2`
  )?.textContent;

  if (titleMA4Top) return fmt(titleMA4Top);

  // 旧サイト（MASTER ARTIST 3 Series）
  const titleMA3 = doc.querySelector(
    `.discoTitle#${cdId} > .titleInfo > h2`
  )?.textContent;

  if (titleMA3) return fmt(titleMA3);

  // サイトタイトルから抽出
  return fmt(doc.title.replace(/^アイドルマスター\s*[|｜]\s*/, ""));
}

/**
 * アートワーク画像を取得（コロムビア公式通販）
 * @param cdId CDID
 * @returns ジャケットURL
 */
async function fetchArtwork(cdId: string): Promise<string> {
  const url = `https://columbia.jp/prod-info/jacket/${cdId}.jpg`;
  const res = await ky.get(url, { timeout: 5000, throwHttpErrors: false });

  return res.ok ? url : "";
}

/**
 * CD詳細ページをスクレイピングする
 * @param pageUrl URL
 */
export async function scrapeCdPage(pageUrl: string) {
  const cdList = new CDList();

  // URLからCDのIDを抽出
  const idMatched = pageUrl.match(/(?<A>(?:CO|XT)\S+)?\.html#?(?<B>CO\S+$)?/);
  const cdId = idMatched?.groups?.B || idMatched?.groups?.A;

  if (!cdId) {
    console.log(`[SKIP] CDIDが抽出できませんでした (${pageUrl})`);
    return undefined;
  }

  // 重複を確認
  if (cdList.searchById(cdId)) {
    console.log(`[SKIP] 既に登録されています (${pageUrl})`);
    return undefined;
  }

  // CDページを取得
  const { html, doc } = await fetchHtml(pageUrl);
  await wait(5);

  // タイトルを抽出
  const title = getTitle(doc, cdId);

  // アートワーク画像のURLを抽出
  const imagePath = html.match(
    new RegExp(`\(\(\?\:images\?\|img\)\/${cdId}.\(\?\:jpg\|png\)\)`)
  )?.[1];

  // 見つからない場合、コロムビア公式通販を参照する
  const artworkUrl = imagePath
    ? pageUrl.replace(/[^/]+\.html(#.+)?$/, imagePath)
    : await fetchArtwork(cdId);

  if (artworkUrl === "") {
    console.log(`[INFO] アートワークが見つかりませんでした (${pageUrl})`);
  }

  console.log("-".repeat(25));
  console.log(`CDID: ${cdId}`);
  console.log(`タイトル: ${title}`);
  console.log(`ページ URL: ${pageUrl}`);
  console.log(`アートワーク画像 URL: ${artworkUrl}`);

  // 追加して保存
  cdList.add({
    id: cdId,
    title,
    page: pageUrl,
    artwork: artworkUrl,
  });

  cdList.write();
}
