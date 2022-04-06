import type { CD } from "../../types/cd.ts";

import { CDList } from "../../libs/cd_list.ts";

export class DevCDList extends CDList {
  /**
   * デバッグログ
   * @param cd CDデータ
   */
  private showDebugLog(cd: CD) {
    console.log("-".repeat(25));
    console.log(`ID: ${cd.id}`);
    console.log(`タイトル: ${cd.title}`);
    console.log(`ページ URL: ${cd.page}`);
    console.log(`アートワーク URL: ${cd.artwork}`);
  }

  /**
   * 新規CDデータを追加
   * @param newCd CDデータ
   */
  public add(newCd: CD) {
    // 重複確認
    if (this.searchById(newCd.id)) return;

    // 追加
    this._list.push(newCd);
    this.showDebugLog(newCd);

    // 書き込む
    const json = JSON.stringify(this._list, null, "\t");
    Deno.writeTextFileSync(this._jsonPath, json);
  }
}
