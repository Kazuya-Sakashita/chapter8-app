"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CategoryForm from "../_components/CategoryForm";
import { useCreateAdminCategory } from "@/app/admin/categories/_hooks/useMutateAdminCategories"; // useCreateAdminCategory をインポート

export default function CreateCategoryPage() {
  const [error, setError] = useState<string | null>(null); // エラーメッセージ
  const router = useRouter();
  const { createCategory } = useCreateAdminCategory(); // useCreateAdminCategory を使う

  // カテゴリ作成の処理
  const handleCreateCategory = async (name: string) => {
    setError(null);

    try {
      console.log("カテゴリ作成リクエスト:", { name });

      // useCreateAdminCategory フックを使ってカテゴリ作成
      await createCategory(name);

      // 成功時
      console.log("カテゴリ作成成功、リダイレクト中...");
      router.push("/admin/categories"); // 一覧へリダイレクト
      router.refresh(); // リストを更新
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "不明なエラーが発生しました"
      );
    }
  };

  return (
    <CategoryForm
      onSubmit={handleCreateCategory}
      buttonText="カテゴリを作成"
      error={error}
    />
  );
}
