import { Document } from "../../deps.ts";

import { fetchHtml } from "../../libs/fetch.ts";
import { wait } from "../../libs/util.ts";

import { Artwork } from "../../models/artworks.ts";

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
 * @param ids ID配列
 * @param baseUrl ベースURL
 * @param pagePath CDページへの相対パス
 */
export async function scrapeCdPage(
  ids: string[],
  baseUrl: string,
  pagePath: string
): Promise<Artwork | undefined> {
  const website = new URL(pagePath, baseUrl).href;

  // URLからIDを抽出
  const cdId = website.match(/release_(L[A-Z]{2,3}\S+)\.html$/)?.[1];

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
  if (!res) {
    console.error(`[ERR] アクセスできませんでした (${website})`);
    return;
  }

  await wait(5);

  // タイトルを抽出
  const title = getTitle(res.doc);

  if (!title) {
    throw new Error(`タイトルが抽出できませんでした (${website})`);
  }

  // アートワークのURLを抽出
  const image = getArtworkUrl(website, res.doc);

  if (image?.includes("nowprinting")) {
    console.log(`[SKIP] アートワークがまだありません (${website})`);
    return;
  } else if (!image) {
    throw new Error(`アートワークが見つかりませんでした (${website})`);
  }

  console.log("-".repeat(25));
  console.log(`ID: ${cdId}`);
  console.log(`タイトル: ${title}`);
  console.log(`Webサイト: ${website}`);
  console.log(`アートワーク: ${image}`);

  return Artwork.create({
    _id: cdId,
    title: title || "",
    website,
    image: image || "",
  });
}
