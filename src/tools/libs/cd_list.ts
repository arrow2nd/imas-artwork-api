import type { CDType, CD } from "../../types/cd.ts";

export class CDList {
  private _jsonPath = "";
  private _list = [] as CD[];

  constructor(type: CDType) {
    this._jsonPath = `./src/data/${type}.json`;
    this._list = JSON.parse(Deno.readTextFileSync(this._jsonPath));
  }

  /**
   * IDから探す
   * @param cdId CDID
   * @returns CDデータ
   */
  public searchById(cdId: string): CD | undefined {
    return this._list.find(({ id }) => id === cdId);
  }

  /**
   * 新規CDデータを追加
   * @param newCd CDデータ
   */
  public add(newCd: CD) {
    // 重複確認
    if (this.searchById(newCd.id)) return;

    // 追加
    console.log("-".repeat(25));
    console.log(`ID: ${newCd.id}`);
    console.log(`タイトル: ${newCd.title}`);
    console.log(`ページ URL: ${newCd.page}`);
    console.log(`アートワーク画像 URL: ${newCd.artwork}`);

    this._list.push(newCd);

    // 書き込む
    const json = JSON.stringify(this._list, null, "\t");
    Deno.writeTextFileSync(this._jsonPath, json);
  }
}
