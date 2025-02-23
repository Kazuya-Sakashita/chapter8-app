"use client";

import useSWR from "swr";
import { Post } from "@/app/_types/post";
import { Category } from "@/app/_types/category";

// APIリクエスト用の fetcher 関数
const fetcher = (url: string) => fetch(url).then((res) => res.json());

/**
 * API から取得する記事の型 (APIレスポンス用)
 */
export type PostFromAPI = Omit<Post, "categories"> & {
  postCategories: {
    category: Category;
  }[];
};

/**
 * APIから取得した記事データを適切な形に整形する関数
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
    : [], // `postCategories` が `undefined` の場合、空配列を返す
});

/**
 * 記事一覧を取得するカスタムフック
 */
export const usePosts = () => {
  const { data, error, isLoading } = useSWR<{ posts: PostFromAPI[] }>(
    "/api/posts",
    fetcher
  );

  return {
    posts: data?.posts.map(formatPost) || [],
    isLoading,
    isError: error,
  };
};

/**
 * 特定の記事を取得するカスタムフック
 */
export const usePostById = (postId: string | null) => {
  const swrResponse = useSWR(
    postId ? `/api/admin/posts/${postId}` : null,
    fetcher
  );

  return {
    post: swrResponse.data?.post || null,
    isLoading: swrResponse.isLoading,
    isError: swrResponse.error,
    mutate: swrResponse.mutate,
  };
};

/**
 * カテゴリ一覧を取得するカスタムフック
 */
export const useCategories = () => {
  const { data, error, isLoading } = useSWR<{ categories: Category[] }>(
    "/api/admin/categories",
    fetcher
  );

  return {
    categories: data?.categories || [],
    isLoading,
    isError: error,
  };
};
