"use client";

import { Post } from "@/app/_types/post";

type CategoryType = {
  id: number;
  name: string;
};

type PostCategoryType = {
  category: CategoryType;
};

type PostFromPrisma = {
  id: number;
  title: string;
  content: string;
  thumbnailUrl: string;
  createdAt: string;
  updatedAt: string;
  categories: { id: number; name: string }[];
};

/**
 * API から記事一覧を取得
 */
export const fetchPosts = async (): Promise<Post[]> => {
  try {
    const response = await fetch("/api/posts");

    if (!response.ok) {
      throw new Error(
        `データの取得に失敗しました (status: ${response.status})`
      );
    }

    const data: { posts: PostFromPrisma[] } = await response.json();
    console.log(
      "APIレスポンス (フロントエンド):",
      JSON.stringify(data, null, 2)
    );

    // `data.posts` の存在チェック
    if (!data || !Array.isArray(data.posts) || data.posts.length === 0) {
      console.error("❌ `posts` が正しく取得できませんでした:", data);
      throw new Error("APIレスポンスが不正です: `posts` が含まれていません");
    }

    // `categories` を正しく取得
    const formattedPosts = data.posts.map(
      (post: PostFromPrisma): PostFromPrisma => {
        console.log("Post Categories:", post.categories);

        return {
          id: post.id,
          title: post.title,
          content: post.content,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
          thumbnailUrl: post.thumbnailUrl,
          categories:
            post.categories?.map((category: CategoryType) => ({
              id: category.id,
              name: category.name,
            })) ?? [], // categories をそのまま使用
        };
      }
    );

    console.log(
      "フォーマット後のデータ:",
      JSON.stringify(formattedPosts, null, 2)
    );

    return formattedPosts;
  } catch (error) {
    console.error("fetchPosts エラー:", error);
    throw error;
  }
};

/**
 * API から記事詳細を取得する (`postId` を使用)
 */
export const fetchPostById = async (postId: string): Promise<Post> => {
  console.log(`Fetching post with ID: ${postId}`);

  const response = await fetch(`/api/posts/${postId}`);

  if (!response.ok) {
    throw new Error("データの取得に失敗しました");
  }

  const data = await response.json();
  console.log("Fetched Post Data:", JSON.stringify(data, null, 2)); // デバッグ用

  // 記事データが正しく取得できているか確認
  if (!data.post) {
    throw new Error("記事データが見つかりません");
  }

  return {
    id: data.post.id,
    title: data.post.title,
    content: data.post.content,
    createdAt: new Date(data.post.createdAt).toISOString(),
    updatedAt: new Date(data.post.updatedAt).toISOString(),
    thumbnailUrl: data.post.thumbnailUrl,
    categories: data.post.postCategories.map((pc: PostCategoryType) => ({
      id: pc.category.id,
      name: pc.category.name,
    })), // `postCategories` を `categories` に変換
  };
};

/**
 * API からカテゴリ一覧を取得
 */
export const fetchCategories = async (): Promise<CategoryType[]> => {
  try {
    const response = await fetch("/api/admin/categories");

    if (!response.ok) {
      throw new Error(
        `データの取得に失敗しました (status: ${response.status})`
      );
    }

    const data: { categories: CategoryType[] } = await response.json();
    console.log(
      "APIレスポンス (フロントエンド):",
      JSON.stringify(data, null, 2)
    );

    // `data.categories` の存在チェック
    if (
      !data ||
      !Array.isArray(data.categories) ||
      data.categories.length === 0
    ) {
      console.error("`categories` が正しく取得できませんでした:", data);
      throw new Error(
        "APIレスポンスが不正です: `categories` が含まれていません"
      );
    }

    return data.categories;
  } catch (error) {
    console.error("fetchCategories エラー:", error);
    return []; // エラー時は空の配列を返す
  }
};
