import { Document } from "deno-dom-wasm";

import { fetchHtml } from "../../libs/fetch.ts";
import { wait } from "../../libs/util.ts";

import { Artwork } from "../../models/artworks.ts";

/**
 * タイトルを取得
 * @param doc ドキュメント
 * @returns タイトル
 */
function getTitle(doc: Document): string | undefined {
  // 括弧で囲まれた文字列・ゲーム名・空白・改行を削除
  const fmt = (text: string) => {
    return text
      .replace(/(^\S*『.+?』\S*\n|タイトル[:：]|)/g, "")
      .replace(/[　 \n\u00a0]+/g, " ") // \u00a0 = ノーブレークスペース
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

  return;
}

/**
 * アートワーク画像のパスを取得
 * @param pageUrl ページURL
 * @param doc ドキュメント
 * @returns アートワークURL
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

  return;
}

/**
 * CDIDを抽出
 * @param text 文字列
 * @returns CDID
 */
function getCdId(text: string): string | undefined {
  return text.match(/(L[A-Z]{2,3}-\d{4,5})/)?.[1].toUpperCase();
}

/**
 * 詳細ページをスクレイピングする
 * @param ids ID配列
 * @param baseUrl ベースURL
 * @param pagePath 詳細ページへの相対パス
 * @returns アートワークデータ
 */
export async function scrapeCdPage(
  ids: string[],
  baseUrl: string,
  pagePath: string,
): Promise<Artwork | undefined> {
  const isDuplicate = (cdId: string) => ids.find((id) => id === cdId);

  const website = new URL(pagePath, baseUrl).href;

  // URLからIDを抽出
  let cdId = getCdId(website);

  // 重複を確認
  if (cdId && isDuplicate(cdId)) return;

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

  // CDIDが未抽出の場合、アートワークURLからの抽出を試みる
  if (!cdId) {
    cdId = getCdId(image);
  }

  if (!cdId || isDuplicate(cdId)) {
    console.log(
      `[SKIP] 既に登録されている、もしくはIDが取得できませんでした (${image} / ${website})`,
    );
    return;
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
