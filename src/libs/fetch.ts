import { Document, DOMParser } from "deno-dom-wasm";
import ky from "ky";

/**
 * UTF-8のHTML文字列を取得
 * @param res レスポンス
 * @returns HTML文字列
 */
async function getHtmlUtf8(res: Response) {
  const resBuf = await res.arrayBuffer();
  const text = new TextDecoder().decode(resBuf);

  // Shift-JISならUTF-8に変換
  return text.includes("text/html; charset=Shift_JIS")
    ? new TextDecoder("shift-jis").decode(resBuf)
    : text;
}

type FetchHtmlResult = {
  html: string;
  doc: Document;
};

/**
 * URLからHTML・Documentを取得
 * @param url URL
 * @returns HTML, Document
 */
export async function fetchHtml(
  url: string,
): Promise<FetchHtmlResult | undefined> {
  const res = await ky.get(url, {
    headers: {
      "User-Agent": "imas-artwork-api Crawler (contact@arrow2nd.com)",
    },
    timeout: 5000,
    throwHttpErrors: false,
  });

  if (!res.ok) {
    console.error(`[ERR: ${res.status}] アクセスできませんでした (${url})`);
    return;
  }

  const html = await getHtmlUtf8(res);
  const doc = new DOMParser().parseFromString(html, "text/html");

  if (!doc) {
    throw new Error("HTMLの解析に失敗しました");
  }

  return { html, doc };
}
