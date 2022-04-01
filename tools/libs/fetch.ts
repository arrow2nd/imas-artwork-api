import { DOMParser } from "./deps.ts";

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

/**
 * URLからDocumentオブジェクトを取得
 * @param url URL
 * @returns Document
 */
export async function fetchHtmlDocment(url: string) {
  // 5秒でタイムアウト
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), 5000);

  const res = await fetch(url, { signal: ctrl.signal }).catch(() => {
    throw new Error("通信がタイムアウトしました");
  });

  clearTimeout(id);

  const html = await getHtmlUtf8(res);
  const doc = new DOMParser().parseFromString(html, "text/html");
  if (!doc) throw new Error("HTMLの解析に失敗しました");

  return doc;
}
