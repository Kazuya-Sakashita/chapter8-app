"use client";

import useSWR, { useSWRConfig } from "swr";
import { Post } from "@/app/_types/post";
import { Category } from "@/app/_types/category";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

/**
 * API から取得する記事データの型 (API レスポンス用)
 */
export type PostFromAPI = Omit<Post, "categories"> & {
  postCategories: {
    category: Category;
  }[];
};

/**
 * API から取得した記事データを適切な形に整形
 */
const formatPost = (data: PostFromAPI): Post => ({
  id: data.id,
  title: data.title,
  content: data.content,
  createdAt: data.createdAt ? new Date(data.createdAt).toISOString() : "",
  updatedAt: data.updatedAt ? new Date(data.updatedAt).toISOString() : "",
  thumbnailUrl: data.thumbnailUrl,
  categories: data.postCategories
    ? data.postCategories.map((pc) => ({
        id: pc.category.id,
        name: pc.category.name,
      }))
    : [],
});

/**
 * 記事一覧を取得するカスタムフック
 */
export const usePosts = () => {
  const { data, error, isLoading, mutate } = useSWR<{ posts: PostFromAPI[] }>(
    "/api/posts",
    fetcher
  );

  return {
    posts: data?.posts.map(formatPost) || [],
    isLoading,
    isError: error,
    mutate,
  };
};

/**
 * 特定の記事を取得するカスタムフック
 */
export const usePostById = (postId: string | null) => {
  const { data, error, isLoading, mutate } = useSWR(
    postId ? `/api/admin/posts/${postId}` : null,
    fetcher
  );

  return {
    post: data?.post ? formatPost(data.post) : null,
    isLoading,
    isError: error,
    mutate,
  };
};

/**
 * カテゴリ一覧を取得するカスタムフック
 */
export const useCategories = () => {
  const { data, error, isLoading, mutate } = useSWR<{ categories: Category[] }>(
    "/api/admin/categories",
    fetcher
  );

  return {
    categories: data?.categories || [],
    isLoading,
    isError: error,
    mutate,
  };
};

/**
 * 記事を作成するカスタムフック
 */
export const useCreatePost = () => {
  const { mutate } = useSWRConfig();

  const createPost = async (postData: {
    title: string;
    content: string;
    thumbnailUrl: string;
    categories: number[];
  }) => {
    try {
      const response = await fetch("/api/admin/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });

      if (!response.ok) throw new Error("記事の作成に失敗しました");

      const newPost = await response.json();

      // 記事一覧のキャッシュを更新
      await mutate("/api/posts");

      return newPost;
    } catch (error) {
      console.error("記事作成エラー:", error);
      throw error;
    }
  };

  return { createPost };
};

/**
 * 記事を更新するカスタムフック
 */
export const useUpdatePost = () => {
  const { mutate } = useSWRConfig();

  const updatePost = async (
    postId: string,
    postData: {
      title: string;
      content: string;
      thumbnailUrl: string;
      categories: number[];
    }
  ) => {
    try {
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });

      if (!response.ok) throw new Error("記事の更新に失敗しました");

      const updatedPost = await response.json();

      // キャッシュを更新して即時反映
      await mutate(`/api/admin/posts/${postId}`);
      await mutate("/api/posts");

      return updatedPost;
    } catch (error) {
      console.error("記事更新エラー:", error);
      throw error;
    }
  };

  return { updatePost };
};

/**
 * 記事を削除するカスタムフック
 */
export const useDeletePost = () => {
  const { mutate } = useSWRConfig();

  const deletePost = async (postId: string) => {
    try {
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("記事の削除に失敗しました");

      // 記事一覧のキャッシュを更新
      await mutate("/api/posts");

      return true;
    } catch (error) {
      console.error("記事削除エラー:", error);
      throw error;
    }
  };

  return { deletePost };
};

/**
 * 特定のカテゴリを取得するカスタムフック
 */
export const useCategoryById = (categoryId: string | null) => {
  const { data, error, isLoading, mutate } = useSWR(
    categoryId ? `/api/admin/categories/${categoryId}` : null,
    fetcher
  );

  return {
    category: data?.category || null,
    isLoading,
    isError: error,
    mutate,
  };
};
