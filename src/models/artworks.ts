import { Document } from "../deps.ts";

import { db } from "../libs/db.ts";
import { escapeRegExp } from "../libs/util.ts";

type FindByKeyword = {
  keyword: string;
  sort?: Document;
  limit?: number;
};

export interface ArtworkSchema {
  _id: string;
  title: string;
  website: string;
  image: string;
}

const artworksCollection = db.collection<ArtworkSchema>("artworks");

export class Artwork {
  private constructor(
    public id: string,
    public title: string,
    public website: string,
    public image: string
  ) {}

  /**
   * 全て取得
   * @returns 検索結果
   */
  static async findAll(): Promise<Artwork[]> {
    const artworks = await artworksCollection.find().toArray();
    return artworks.map((e) => new this(e._id, e.title, e.website, e.image));
  }

  /**
   * IDから検索
   * @param id ID
   * @returns 検索結果
   */
  static async findById(id: string): Promise<Artwork | undefined> {
    const artwork = await artworksCollection.findOne({ _id: id });
    if (!artwork) return;

    return new this(artwork._id, artwork.title, artwork.website, artwork.image);
  }

  /**
   * タイトルキーワードから検索
   * @param keyword キーワード
   * @returns 検索結果
   */
  static async findByKeyword({
    keyword,
    sort,
    limit,
  }: FindByKeyword): Promise<Artwork[] | undefined> {
    // 正規表現文字列をエスケープ
    const escaped = escapeRegExp(keyword);
    const titleRegExp = new RegExp(`${escaped}`, "i");

    const artworks = await artworksCollection
      .find({ title: titleRegExp }, { sort, limit })
      .toArray();

    return artworks.map((e) => new this(e._id, e.title, e.website, e.image));
  }

  /**
   * 新規アートワークデータを作成
   * @param 追加するデータ
   * @returns アートワークデータ
   */
  static create({ _id, title, website, image }: ArtworkSchema): Artwork {
    return new this(_id, title, website, image);
  }

  /**
   * DBに反映
   */
  async commit() {
    const { id, title, website, image } = this;
    await artworksCollection.insertOne({ _id: id, title, website, image });
  }

  /**
   * デバッグログを出力
   */
  debugLog() {
    console.log("-".repeat(25));
    console.log(`ID: ${this.id}`);
    console.log(`タイトル: ${this.title}`);
    console.log(`Webサイト: ${this.website}`);
    console.log(`アートワーク: ${this.image}`);
  }
}
