"use client";

import Link from "next/link";
import CategoryCard from "./_components/categoryCard";
import { useAdminCategories } from "@/app/admin/categories/_hooks/useAdminCategories";

export default function CategoriesPage() {
  const { categories, isLoading, isError } = useAdminCategories(); // SWR を使用してカテゴリデータを取得

  if (isLoading) return <div>読み込み中...</div>;
  if (isError) return <div>エラーが発生しました</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-14">
        <h1 className="text-2xl font-bold mb-4">カテゴリー一覧</h1>
        <Link href="/admin/categories/new">
          <button className="bg-blue-500 text-white hover:bg-blue-700 font-bold py-2 px-4 rounded">
            新規作成
          </button>
        </Link>
      </div>

      {categories.length === 0 ? (
        <p>カテゴリーがありません</p>
      ) : (
        <div>
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      )}
    </div>
  );
}
