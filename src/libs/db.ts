import "https://deno.land/x/dotenv@v3.2.2/load.ts";
import { MongoClient } from "../deps.ts";

const client = new MongoClient();
await client.connect(Deno.env.get("MONGO_DB_URL")!);

export const db = client.database(Deno.env.get("MONGO_DB_NAME")!);
