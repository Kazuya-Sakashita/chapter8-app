export type Post = {
  id: number; // 記事ID
  title: string; // 記事タイトル
  thumbnailUrl: string; // サムネイル画像URL
  createdAt: string; // 作成日時 (ISO 8601)
  categories: string[]; // カテゴリー一覧
  content: string; // 本文（HTML形式）
};
