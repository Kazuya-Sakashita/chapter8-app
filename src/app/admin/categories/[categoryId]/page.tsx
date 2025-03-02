"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import CategoryForm from "@/app/admin/categories/_components/CategoryForm";
import { useAdminCategoryById } from "@/app/admin/categories/_hooks/useAdminCategories";
import {
  useUpdateAdminCategory,
  useDeleteAdminCategory,
} from "@/app/admin/categories/_hooks/useMutateAdminCategories";

export default function EditCategoryPage() {
  const params = useParams();
  const router = useRouter();

  // `categoryId` の取得と型変換
  const categoryIdString = params.categoryId ? String(params.categoryId) : "";

  console.log("カテゴリID:", categoryIdString); // デバッグ用ログ

  // カテゴリデータ取得
  const { category, isLoading, isError } =
    useAdminCategoryById(categoryIdString);

  // カテゴリ更新と削除のフック
  const { updateCategory } = useUpdateAdminCategory();
  const { deleteCategory } = useDeleteAdminCategory();

  const [error, setError] = useState<string | null>(null); // エラーメッセージ

  // カテゴリ更新処理
  const handleSubmit = async (name: string) => {
    setError(null); // エラーメッセージをリセット
    try {
      console.log("送信データ:", { name }); // デバッグ用

      // カテゴリの更新
      await updateCategory(categoryIdString, name);

      // 更新成功後、リダイレクト
      router.push("/admin/categories");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "不明なエラーが発生しました"
      );
    }
  };

  // カテゴリ削除処理
  const handleDelete = async () => {
    if (!confirm("このカテゴリを削除しますか？")) return;
    try {
      console.log("削除リクエスト:", categoryIdString); // デバッグ用

      // カテゴリの削除
      await deleteCategory(categoryIdString);

      // 削除成功後、リダイレクト
      router.push("/admin/categories");
    } catch (err) {
      setError(err instanceof Error ? err.message : "削除中にエラー発生");
    }
  };

  if (isLoading) return <div>読み込み中...</div>;
  if (isError)
    return <div className="text-red-500">エラー: {isError.message}</div>;
  if (!category) return <div>カテゴリが見つかりません</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">カテゴリ編集</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}

      <CategoryForm
        initialName={category.name}
        categoryId={categoryIdString}
        onSubmit={handleSubmit}
        buttonText="更新"
        error={error}
        onDelete={handleDelete}
      />
    </div>
  );
}
