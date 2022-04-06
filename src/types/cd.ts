export type CDType = "columbia" | "million" | "sidem" | "shiny";

export type CD = {
  /** CDID */
  id: string;
  /** タイトル */
  title: string;
  /** ページURL */
  page: string;
  /** アートワークURL */
  artwork: string;
};
