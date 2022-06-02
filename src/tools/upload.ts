import { db } from "../libs/db.ts";
import { ArtworkSchema } from "../models/artworks.ts";

const artworksCollection = db.collection<ArtworkSchema>("artworks");
const data = Deno.readTextFileSync("./data.json");

await artworksCollection.insertMany(JSON.parse(data));

console.log("[OK]");
