const jsonPath = "./src/data/list.json";

export type CD = {
  /** CDID */
  id: string;
  /** タイトル */
  title: string;
  /** ページURL */
  page: string;
  /** アートワークURL */
  artwork: string;
};

export class CDList {
  private _list = [] as CD[];

  constructor() {
    this._list = JSON.parse(Deno.readTextFileSync(jsonPath));
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
   * タイトル名から探す（部分一致）
   * @param keyword キーワード
   * @returns CDデータ配列
   */
  public searchByTitle(keyword: string): CD[] | undefined {
    return this._list.filter(({ title }) => title.includes(keyword));
  }

  /**
   * 新規CDデータを追加
   * @param newCd CDデータ
   */
  public add(newCd: CD) {
    // 重複確認
    if (this.searchById(newCd.id)) return;

    this._list.push(newCd);
  }

  /**
   * JSONファイルに書き込む
   */
  public write() {
    const json = JSON.stringify(this._list, null, "\t");
    Deno.writeTextFileSync(jsonPath, json);
  }
}
