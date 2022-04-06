import { fetchHtml } from "../libs/fetch.ts";

import { parseCdInfo } from "./cd_info.ts";

const baseUrl = "https://shinycolors.lantis.jp/discography/";

// メインページを取得
const { doc } = await fetchHtml(baseUrl);

console.log(`[OK] メインページ取得完了 (${baseUrl})`);

// ジャケット要素を抽出
const jacketElms = doc
  .getElementsByClassName("list")
  .map((e) => e.getElementsByTagName("a"))
  .flat();

console.log(`[OK] ジャケット要素取得完了 (${jacketElms.length} 件)`);

// 各要素に対して処理
for (const jacketElm of jacketElms) {
  parseCdInfo(jacketElm);
}

console.log(`[SUCCESS]`);
