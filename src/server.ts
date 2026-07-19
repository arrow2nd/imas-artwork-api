import { Hono } from "hono";
import { cors } from "hono/middleware";
import { router } from "./libs/router.ts";
import { createError } from "./libs/util.ts";

const app = new Hono();

// 公開APIとしてどのオリジンからも叩けるようにする
app.use("*", cors());

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
