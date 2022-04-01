import { fetchHtmlDocment } from "./libs/fetch.ts";

// const elms = [
//   ...doc.querySelectorAll(".discolistMini > ul > li > a"),
// ] as Element[];
// const a = elms.map((e) => e.getAttribute("href"));

const baseUrl = "https://columbia.jp/idolmaster/";

const doc = await fetchHtmlDocment(baseUrl + "index.html");
const pageUrls = [...doc.querySelectorAll(".jacketLink")].map((e) =>
  e.parentElement?.getAttribute("href")
);

for (const url of pageUrls) {
  if (typeof url !== "string") continue;

  const doc = await fetchHtmlDocment(/^https/.test(url) ? url : baseUrl + url);

  const cdId = url.match(/\/(.+)\.html$/)?.[1];
  if (!cdId) continue;

  const pageTitle = doc.title.replace(/^アイドルマスター\s*\|\s*/, "");

  const albumartUrl = doc.textContent.match(
    new RegExp(`(?:image|img)/${cdId}.(?:jpg|png)`)
  )?.[1];

  console.log(pageTitle);
  console.log(albumartUrl);

  await new Promise((e) => setTimeout(e, 2000));
}

console.log(pageUrls);
