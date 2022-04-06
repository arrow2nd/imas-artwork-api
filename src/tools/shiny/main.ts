import { fetchHtml } from "../libs/fetch.ts";

import { parseLinkElement } from "./parse.ts";

const baseUrl = "https://shinycolors.lantis.jp/discography/";

// メインページを取得
const { doc } = await fetchHtml(baseUrl);

console.log(`[OK] メインページ取得完了 (${baseUrl})`);

// 詳細ページへのリンク要素を抽出
const aElms = doc
  .getElementsByClassName("list")
  .map((e) => e.getElementsByTagName("a"))
  .flat();

console.log(`[OK] 詳細ページのリンク要素取得完了 (${aElms.length} 件)`);

// 各要素を解析
for (const aElm of aElms) {
  parseLinkElement(aElm);
}

console.log(`[SUCCESS]`);
