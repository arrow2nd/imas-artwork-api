/**
 * 指定秒数待機
 * @param sec 秒数
 */
export function wait(sec: number): Promise<void> {
  return new Promise((e) => setTimeout(e, sec * 1000));
}

/**
 * 正規表現文字列をエスケープ
 * @param text 文字列
 * @returns エスケープ後の文字列
 */
export function escapeRegExp(text: string): string {
  return text.replace(/([$()*+\-.?\[\]^{|}])/g, "\\$1");
}

type ErrorMessage = {
  message: string;
};

/**
 * エラーメッセージオブジェクトを生成
 * @param msg メッセージ
 */
export function createError(msg: string): ErrorMessage {
  return { message: msg };
}
