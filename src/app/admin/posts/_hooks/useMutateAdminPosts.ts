"use client";

import { useAdminPosts } from "../_hooks/useAdminPosts";

/**
 * 記事を作成（管理者用）
 */
export const useCreateAdminPost = () => {
  const { mutate } = useAdminPosts(); // 記事一覧のキャッシュ更新用

  const createPost = async (postData: {
    title: string;
    content: string;
    thumbnailImageKey: string;
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
      await mutate(); // 記事一覧のキャッシュを更新

      return newPost;
    } catch (error) {
      console.error("記事作成エラー:", error);
      throw error;
    }
  };

  return { createPost };
};

/**
 * 記事を更新（管理者用）
 */
export const useUpdateAdminPost = () => {
  const { mutate } = useAdminPosts(); // 記事一覧のキャッシュ更新用

  const updatePost = async (
    postId: string,
    postData: {
      title: string;
      content: string;
      thumbnailImageKey: string;
      categories: number[];
    }
  ) => {
    console.log("送信するデータ:", postData);

    try {
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("APIエラー:", errorData);
        throw new Error("記事の更新に失敗しました");
      }

      const updatedPost = await response.json();
      await mutate(); // 記事一覧のキャッシュを更新

      return updatedPost;
    } catch (error) {
      console.error("記事更新エラー:", error);
      throw error;
    }
  };

  return { updatePost };
};

/**
 * 記事を削除（管理者用）
 */
export const useDeleteAdminPost = () => {
  const { mutate } = useAdminPosts(); // 記事一覧のキャッシュ更新用

  const deletePost = async (postId: string) => {
    try {
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("記事の削除に失敗しました");

      await mutate(); // 記事一覧のキャッシュを更新

      return true;
    } catch (error) {
      console.error("記事削除エラー:", error);
      throw error;
    }
  };

  return { deletePost };
};
