export type Genre = "columbia" | "million" | "sidem" | "shiny";

export type CD = {
  /** CDID */
  id: string;
  /** タイトル */
  title: string;
  /** ページURL */
  website: string;
  /** アートワークURL */
  artwork: string;
};
