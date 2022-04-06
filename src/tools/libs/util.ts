/**
 * 指定秒数待機
 * @param sec 秒数
 */
export function wait(sec: number): Promise<void> {
  return new Promise((e) => setTimeout(e, sec * 1000));
}
