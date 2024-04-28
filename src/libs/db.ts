import "dotenv/load.ts";
import { MongoClient } from "mongo";

const client = new MongoClient();
await client.connect(Deno.env.get("MONGO_DB_URL")!);

export const db = client.database(Deno.env.get("MONGO_DB_NAME")!);
