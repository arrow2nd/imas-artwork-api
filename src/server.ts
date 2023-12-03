import { Hono } from "./deps.ts";
import { router } from "./libs/router.ts";
import { createError } from "./libs/util.ts";

const app = new Hono();

app.notFound((ctx) => {
  return ctx.json(createError("Not Found"));
});

app.onError((err, ctx) => {
  console.error(err);
  ctx.status(500);
  return ctx.json(createError(`${err.name}: ${err.message}`));
});

app.route("/", router);

Deno.serve(app.fetch);
