import { db } from "../libs/db.ts";
import { ArtworkSchema, Artwork } from "../models/artworks.ts";

import { updateColumbia } from "./columbia/main.ts";
import { updateLantis } from "./lantis/main.ts";
import { updateShiny } from "./shiny/main.ts";

const artworksCollection = db.collection<ArtworkSchema>("artworks");

const artworkIds = (await artworksCollection.find().toArray()).map(
  ({ _id }) => _id
);

let artworks = [] as Artwork[];

artworks = artworks.concat(
  await updateColumbia(artworkIds),
  await updateLantis(artworkIds),
  await updateShiny(artworkIds)
);

if (artworks.length !== 0) {
  console.log(artworks);
  await artworksCollection.insertMany(artworks);
}

console.log("[OK]");
