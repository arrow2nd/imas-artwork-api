import { Hono, serve } from "./deps.ts";
import { router } from "./libs/router.ts";

const app = new Hono();

app.onError((err, ctx) => {
  console.error(err.message);
  return ctx.text(`Internal Server Error: ${err.message}`, 500);
});

app.route("/", router);

serve(app.fetch);
