"use client";

import { useRouter, useParams } from "next/navigation";
import CategoryForm from "@/app/admin/categories/_components/CategoryForm";
import {
  useAdminCategoryById,
  useAdminCategories,
} from "@/app/admin/categories/_hooks/useAdminCategories";

export default function EditCategoryPage() {
  const params = useParams();
  const router = useRouter();

  // `categoryId` の取得と型変換
  const categoryIdString = params.categoryId ? String(params.categoryId) : "";

  console.log("カテゴリID:", categoryIdString); // デバッグ用ログ

  // カテゴリデータ取得
  const { category, isLoading, isError } =
    useAdminCategoryById(categoryIdString);
  const { mutate } = useAdminCategories(); // `useAdminCategories` の `mutate` を使用

  // カテゴリ更新処理
  const handleSubmit = async (name: string) => {
    try {
      console.log("送信データ:", { name }); // デバッグ用

      const response = await fetch(
        `/api/admin/categories/${categoryIdString}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("APIエラー:", errorData); // APIのエラーレスポンスを確認
        throw new Error(errorData.message || "カテゴリの更新に失敗しました");
      }

      console.log("カテゴリ更新成功"); // 成功ログ
      await mutate(); // `useAdminCategories` のキャッシュを更新
      router.push("/admin/categories");
    } catch (err) {
      console.error("カテゴリ更新に失敗:", err);
    }
  };

  // カテゴリ削除処理
  const handleDelete = async () => {
    if (!confirm("このカテゴリを削除しますか？")) return;
    try {
      console.log("削除リクエスト:", categoryIdString); // デバッグ用

      const response = await fetch(
        `/api/admin/categories/${categoryIdString}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("APIエラー:", errorData);
        throw new Error(errorData.message || "カテゴリの削除に失敗しました");
      }

      console.log("カテゴリ削除成功");
      await mutate(); // `useAdminCategories` のキャッシュを更新
      router.push("/admin/categories");
    } catch (err) {
      console.error("削除中にエラー発生:", err);
    }
  };

  if (isLoading) return <div>読み込み中...</div>;
  if (isError)
    return <div className="text-red-500">エラー: {isError.message}</div>;
  if (!category) return <div>カテゴリが見つかりません</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">カテゴリ編集</h1>
      <CategoryForm
        initialName={category.name}
        categoryId={categoryIdString}
        onSubmit={handleSubmit}
        buttonText="更新"
        error={isError?.message || null} // `isLoading` 削除
        onDelete={handleDelete}
      />
    </div>
  );
}
