import { Application } from "./deps.ts";
import { router } from "./libs/router.ts";

const app = new Application();

app.addEventListener("listen", ({ hostname, port, secure }) => {
  const host = hostname === "0.0.0.0" ? "localhost" : hostname;
  const url = `${secure ? "https" : "http"}://${host}:${port}`;

  console.log(`Listening on ${url}`);
});

app.addEventListener("error", (ev) => {
  console.error(ev.error);
});

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
