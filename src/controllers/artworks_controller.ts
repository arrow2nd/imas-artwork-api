import { Context, Status, helpers } from "../deps.ts";
import { Artwork } from "../models/artworks.ts";

export const artworkController = {
  /**
   * GitHubへリダイレクト
   * @param context コンテキスト
   */
  redirect(context: Context) {
    context.response.redirect("https://github.com/arrow2nd/imas-artwork-api");
  },

  /**
   * /artwork/:id
   * @param context コンテキスト
   */
  async get(context: Context) {
    const { id } = helpers.getQuery(context, { mergeParams: true });
    const artwork = await Artwork.findById(id);

    if (!artwork) {
      context.response.status = Status.NotFound;
    }

    context.response.body = artwork || { message: "Not Found" };
  },

  /**
   * /list
   * @param context コンテキスト
   */
  async search(context: Context) {
    const { keyword } = helpers.getQuery(context);
    const artworks = await Artwork.findByKeyword(keyword);

    if (!artworks) {
      context.response.status = Status.NotFound;
    }

    context.response.body = artworks || { message: "Not Found" };
  },
};
