"use client";

import { useSWRConfig } from "swr";

/**
 * カテゴリを作成（管理者用）
 */
export const useCreateAdminCategory = () => {
  const { mutate } = useSWRConfig();

  const createCategory = async (name: string) => {
    try {
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) throw new Error("カテゴリの作成に失敗しました");

      const newCategory = await response.json();
      await mutate("/api/admin/categories");

      return newCategory;
    } catch (error) {
      console.error("カテゴリ作成エラー:", error);
      throw error;
    }
  };

  return { createCategory };
};

/**
 * カテゴリを更新（管理者用）
 */
export const useUpdateAdminCategory = () => {
  const { mutate } = useSWRConfig();

  const updateCategory = async (categoryId: string, name: string) => {
    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) throw new Error("カテゴリの更新に失敗しました");

      const updatedCategory = await response.json();
      await mutate(`/api/admin/categories/${categoryId}`);
      await mutate("/api/admin/categories");

      return updatedCategory;
    } catch (error) {
      console.error("カテゴリ更新エラー:", error);
      throw error;
    }
  };

  return { updateCategory };
};

/**
 * カテゴリを削除（管理者用）
 */
export const useDeleteAdminCategory = () => {
  const { mutate } = useSWRConfig();

  const deleteCategory = async (categoryId: string) => {
    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("カテゴリの削除に失敗しました");

      await mutate("/api/admin/categories");

      return true;
    } catch (error) {
      console.error("カテゴリ削除エラー:", error);
      throw error;
    }
  };

  return { deleteCategory };
};
