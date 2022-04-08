import { Document, ky } from "../../dev_deps.ts";

import { fetchHtml } from "../../libs/fetch.ts";
import { wait } from "../../libs/util.ts";

import { Artwork } from "../../models/artworks.ts";

/**
 * タイトルを取得
 * @param doc ドキュメント
 * @param cdId ID
 * @returns タイトル
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
 * @param cdId ID
 * @returns アートワークURL
 */
async function fetchArtwork(cdId: string): Promise<string> {
  const url = `https://columbia.jp/prod-info/jacket/${cdId}.jpg`;
  const res = await ky.get(url, { timeout: 5000, throwHttpErrors: false });

  await wait(5);

  return res.ok ? url : "";
}

/**
 * 詳細ページをスクレイピング
 * @param ids ID配列
 * @param website URL
 * @returns アートワークデータ
 */
export async function scrapeCdPage(
  ids: string[],
  website: string
): Promise<Artwork | undefined> {
  // URLからCDのIDを抽出
  const idMatched = website.match(/(?<A>(?:CO|XT)\S+)?\.html#?(?<B>CO\S+$)?/);
  const cdId = idMatched?.groups?.B || idMatched?.groups?.A;

  if (!cdId) {
    console.log(`[SKIP] IDが抽出できませんでした (${website})`);
    return;
  }

  // 重複を確認
  if (ids.find((id) => id === cdId)) {
    console.log(`[SKIP] 既に登録されています (${website})`);
    return;
  }

  // 詳細ページを取得
  const res = await fetchHtml(website);
  if (!res) return;

  await wait(5);

  // タイトルを抽出
  const title = getTitle(res.doc, cdId);

  // アートワークのURLを抽出
  const imagePath = res.html.match(
    new RegExp(`\(\(\?\:images\?\|img\)\/${cdId}.\(\?\:jpg\|png\)\)`)
  )?.[1];

  // 見つからない場合、コロムビア公式通販を参照する
  const image = imagePath
    ? new URL(imagePath, website).href
    : await fetchArtwork(cdId);

  if (image === "") {
    throw new Error(`アートワークが見つかりませんでした (${website})`);
  }

  // アートワークデータを作成
  const artwork = Artwork.create({
    _id: cdId,
    title: title || "",
    website,
    image: image || "",
  });

  artwork.debugLog();

  return artwork;
}
