"use client";

import useSWR from "swr";
import { fetcher } from "@/app/lib/fetcher";
import { Post } from "@/app/_types/post";
import { Category } from "@/app/_types/category";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";

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
  thumbnailImageKey: data.thumbnailImageKey,
  categories: data.postCategories
    ? data.postCategories.map((pc) => ({
        id: pc.category.id,
        name: pc.category.name,
      }))
    : [],
});

/**
 * 記事一覧を取得（管理者用）
 */
export const useAdminPosts = () => {
  const { token } = useSupabaseSession(); // adminの時にのみtokenを取得
  console.log("token:", token);

  const { data, error, isLoading, mutate } = useSWR<{ posts: PostFromAPI[] }>(
    ["/api/admin/posts"],
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
 * 特定の記事を取得（管理者用）
 */
export const useAdminPostById = (postId: string | null) => {
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
