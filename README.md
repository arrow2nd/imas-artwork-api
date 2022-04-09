# imas-artwork-api

アイマス CD のアートワーク API

## エンドポイント

### GET /cd/[id]

> CD の ID (品番) からアートワークを取得

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

### GET /list

> キーワードからアートワークを一覧で取得

#### クエリパラメータ

| 必須か | 名前    | 型              | 内容           |
| ------ | ------- | --------------- | -------------- |
| 必須   | keyword | string          | 検索キーワード |
| 任意   | order   | "id" \| "title" | ソート基準     |
| 任意   | orderby | "asc" \| "desc" | ソート順       |
| 任意   | limit   | number          | 取得件数       |

- `order` 及び `orderby` を指定しない場合は順不同となります。

#### レスポンス (配列)

| 名前    | 型     | 内容                 |
| ------- | ------ | -------------------- |
| id      | string | CD の ID(品番)       |
| title   | string | タイトル             |
| website | string | CD の詳細ページ URL  |
| image   | string | アートワーク画像 URL |

- 見つからなかった場合は空の配列が返ります。
