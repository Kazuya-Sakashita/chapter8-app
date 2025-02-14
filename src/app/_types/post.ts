export type Category = {
  id: number;
  name: string;
};

export type Post = {
  id: number;
  title: string;
  content: string;
  thumbnailUrl: string;
  createdAt: string;
  updatedAt: string;
  categories: Category[]; // `categories` を定義
};
