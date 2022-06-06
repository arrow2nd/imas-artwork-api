# imas-artwork-api

アイマス CD の非公式アートワーク情報 API

## エンドポイント

`https://imas-artwork-api.deno.dev/v1/`

### GET /cd/:id

CD の ID (品番) からアートワークを取得

#### パスパラメータ

| 名前 | 型     | 内容            |
| ---- | ------ | --------------- |
| id   | string | CD の ID (品番) |

#### レスポンス

| 名前    | 型     | 内容                 |
| ------- | ------ | -------------------- |
| id      | string | CD の ID(品番)       |
| title   | string | タイトル             |
| website | string | CD の詳細ページ URL  |
| image   | string | アートワーク画像 URL |

#### 例

リクエスト

```sh
curl "https://imas-artwork-api.deno.dev/v1/cd/LACA-15905"
```

レスポンス

```json
{
  "id": "LACA-15905",
  "title": "THE IDOLM@STER MILLION LIVE! M@STER SPARKLE2 05",
  "website": "https://www.lantis.jp/imas/release_SPARKLE2_05.html",
  "image": "https://www.lantis.jp/imas/img/LACA-15905_H1.jpg"
}
```

### GET /list

キーワードからアートワークを一覧で取得

#### クエリパラメータ

| 名前    | 型              | 内容           | 必須か |
| ------- | --------------- | -------------- | ------ |
| keyword | string          | 検索キーワード | 必須   |
| order   | "id" \| "title" | ソート基準     | 任意   |
| orderby | "asc" \| "desc" | ソート順       | 任意   |
| limit   | number          | 取得件数       | 任意   |

- `order` 及び `orderby` を指定しない場合は順不同となります。

#### レスポンス (配列)

| 名前    | 型     | 内容                 |
| ------- | ------ | -------------------- |
| id      | string | CD の ID(品番)       |
| title   | string | タイトル             |
| website | string | CD の詳細ページ URL  |
| image   | string | アートワーク画像 URL |

#### 例

リクエスト

```sh
curl "https://imas-artwork-api.deno.dev/v1/list?keyword=%E7%99%BD%E8%8F%8A%E3%81%BB%E3%81%9F%E3%82%8B&order=id&orderby=asc"
```

レスポンス

```json
[
  {
    "id": "COCC-17628",
    "title": "THE IDOLM@STER CINDERELLA MASTER 052 白菊ほたる",
    "website": "https://columbia.jp/idolmaster/COCC-17628.html",
    "image": "https://columbia.jp/idolmaster/img/COCC-17628.jpg"
  }
]
```
