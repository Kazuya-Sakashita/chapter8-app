export type Category = {
  id: number;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
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
