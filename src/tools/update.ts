import { db } from "../libs/db.ts";
import { ArtworkSchema } from "../models/artworks.ts";

import { updateColumbia } from "./columbia/main.ts";
import { updateLantis } from "./lantis/main.ts";
import { updateShiny } from "./shiny/main.ts";

const artworksCollection = db.collection<ArtworkSchema>("artworks");

const artworkIds = (await artworksCollection.find().toArray()).map(
  ({ _id }) => _id,
);

const newArtworks = [
  await updateColumbia(artworkIds),
  await updateLantis(artworkIds),
  await updateShiny(artworkIds),
].flat().map(({ id, title, website, image }) => ({
  _id: id,
  title,
  website,
  image,
}));

if (newArtworks.length !== 0) {
  console.log(newArtworks);
  Deno.writeTextFileSync(
    "./data.json",
    JSON.stringify(newArtworks, null, "  "),
  );
}

console.log("[OK]");
