import type { Genre, CD } from "../types/cd.ts";

export class CDList {
  protected _jsonPath = "";
  protected _list = [] as CD[];

  /**
   * @param genre 読み込むジャンル
   */
  constructor(genre?: Genre) {
    const genreToload: Genre[] = genre
      ? [genre]
      : ["columbia", "million", "shiny", "sidem"];

    // それぞれのデータを読み込んで結合
    for (const genre of genreToload) {
      this._jsonPath = `./src/data/${genre}.json`;
      this._list = this._list.concat(
        JSON.parse(Deno.readTextFileSync(this._jsonPath))
      );
    }
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
}
