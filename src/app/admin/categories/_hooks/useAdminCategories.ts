"use client";

import useSWR from "swr";
import { fetcher } from "@/app/lib/fetcher";
import { Category } from "@/app/_types/category";

/**
 * カテゴリ一覧を取得（管理者用）
 */
export const useAdminCategories = () => {
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
 * 特定のカテゴリを取得（管理者用）
 */
export const useAdminCategoryById = (categoryId: string | null) => {
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
