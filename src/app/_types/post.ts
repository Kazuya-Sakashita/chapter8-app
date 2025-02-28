import { Category } from "./category";

export type Post = {
  id: number;
  title: string;
  content: string;
  thumbnailImageKey: string;
  createdAt?: string;
  updatedAt?: string;
  categories: Category[]; // `categories` を定義
};

export type CreatePostRequest = Post;
