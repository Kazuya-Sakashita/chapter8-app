"use client";

import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { useAdminCategories } from "../_hooks/useAdminCategories";

/**
 * カテゴリを作成（管理者用）
 */
export const useCreateAdminCategory = () => {
  const { mutate } = useAdminCategories(); // 一覧のキャッシュ更新用
  const { token } = useSupabaseSession();

  const createCategory = async (name: string) => {
    try {
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) throw new Error("カテゴリの作成に失敗しました");

      const newCategory = await response.json();
      await mutate(); // 一覧のキャッシュを更新

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
  const { mutate } = useAdminCategories(); // 一覧のキャッシュ更新用
  const { token } = useSupabaseSession();

  const updateCategory = async (categoryId: string, name: string) => {
    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) throw new Error("カテゴリの更新に失敗しました");

      const updatedCategory = await response.json();
      await mutate(); // 一覧のキャッシュを更新

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
  const { mutate } = useAdminCategories(); // 一覧のキャッシュ更新用
  const { token } = useSupabaseSession();

  const deleteCategory = async (categoryId: string) => {
    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (!response.ok) throw new Error("カテゴリの削除に失敗しました");

      await mutate(); // 一覧のキャッシュを更新

      return true;
    } catch (error) {
      console.error("カテゴリ削除エラー:", error);
      throw error;
    }
  };

  return { deleteCategory };
};
