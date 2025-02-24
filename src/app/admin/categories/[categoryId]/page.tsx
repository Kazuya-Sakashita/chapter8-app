"use client";

import { useRouter, useParams } from "next/navigation";
import CategoryForm from "@/app/admin/categories/_components/CategoryForm";
import { useCategoryById } from "@/app/lib/swrApi";
import { useSWRConfig } from "swr";

export default function EditCategoryPage() {
  const { categoryId } = useParams();
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const categoryIdString = Array.isArray(categoryId)
    ? categoryId[0]
    : categoryId;

  // カスタムフックを使用してカテゴリデータを取得
  const { category, isLoading, isError } = useCategoryById(categoryIdString);

  // カテゴリ更新処理
  const handleSubmit = async (name: string) => {
    try {
      const response = await fetch(
        `/api/admin/categories/${categoryIdString}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name }),
        }
      );

      if (!response.ok) {
        throw new Error("カテゴリの更新に失敗しました");
      }

      // SWRのキャッシュを更新
      await mutate(`/api/admin/categories/${categoryIdString}`, undefined, {
        revalidate: true,
      });
      await mutate("/api/admin/categories", undefined, { revalidate: true });

      router.push("/admin/categories");
    } catch (err) {
      console.error("カテゴリ更新に失敗:", err);
    }
  };

  // カテゴリ削除処理
  const handleDelete = async () => {
    if (!confirm("このカテゴリを削除しますか？")) return;
    try {
      const response = await fetch(
        `/api/admin/categories/${categoryIdString}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("カテゴリの削除に失敗しました");
      }

      // SWRのキャッシュを更新
      await mutate("/api/admin/categories", undefined, { revalidate: true });

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
        isLoading={isLoading}
        error={isError?.message || null}
        onDelete={handleDelete}
      />
    </div>
  );
}
