"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CategoryForm from "../_components/CategoryForm";

export default function CreateCategoryPage() {
  const [error, setError] = useState<string | null>(null); // エラーメッセージ
  const router = useRouter();

  // カテゴリ作成の処理
  const handleCreateCategory = async (name: string) => {
    setError(null);

    try {
      console.log("カテゴリ作成リクエスト:", { name });

      // APIリクエストを送信
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      const result = await response.json();
      console.log("レスポンス:", result);

      // エラーがある場合
      if (!response.ok) {
        throw new Error(result.status || "カテゴリの作成に失敗しました");
      }

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
