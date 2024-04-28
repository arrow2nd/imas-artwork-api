import { Context } from "hono";
import { Document } from "deno-dom-wasm";
import { createError } from "../libs/util.ts";
import { Artwork } from "../models/artworks.ts";

enum Order {
  Asc = 1,
  Desc = -1,
}

function setHeader(ctx: Context) {
  ctx.header("Access-Control-Allow-Origin", "*");
}

export const artworkController = {
  /**
   * GitHubへリダイレクト
   * @param ctx コンテキスト
   */
  redirect(ctx: Context) {
    return ctx.redirect("https://github.com/arrow2nd/imas-artwork-api");
  },

  /**
   * /v1/cd/:id
   * @param ctx コンテキスト
   */
  async get(ctx: Context) {
    const id = ctx.req.param("id");
    const artwork = await Artwork.findById(id.trim().toUpperCase());

    setHeader(ctx);

    // IDが存在しない
    if (!artwork) {
      ctx.status(404);
      return ctx.json(createError(`Not Found: ${id}`));
    }

    return ctx.json(artwork);
  },

  /**
   * /v1/list
   * @param ctx コンテキスト
   */
  async search(ctx: Context) {
    const { keyword, order, orderby, limit } = ctx.req.query();

    // キーワードが無い
    if (!keyword) {
      ctx.status(400);
      return ctx.json(createError("Invalid parameter: No keyword parameter"));
    }

    // ソート順
    const orderNum = order === "desc" ? Order.Desc : Order.Asc;

    // ソート基準
    const sorts: Map<string, Document> = new Map([
      ["id", { _id: orderNum }],
      ["title", { title: orderNum }],
    ]);

    const artworks = await Artwork.findByKeyword({
      keyword: keyword.trim(),
      sort: sorts.get(orderby),
      limit: limit ? parseInt(limit) : undefined,
    });

    setHeader(ctx);

    if (!artworks || artworks.length === 0) {
      ctx.status(404);
      return ctx.json(createError(`Not Found: ${keyword}`));
    }

    return ctx.json(artworks);
  },
};
