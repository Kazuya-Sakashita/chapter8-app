"use client";

import { useEffect, useState, useMemo } from "react";
import CategoryCard from "./_components/categoryCard";
import { fetchCategories } from "@/app/lib/prismaApi";
import Link from "next/link";
import { Category } from "@/app/_types/category";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        console.log("取得したカテゴリ:", data);

        // `undefined` の要素を除外
        const validCategories = data.filter(
          (c: Category | undefined) => c !== undefined
        );

        setCategories(validCategories);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "不明なエラーが発生しました"
        );
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  const memoizedCategories = useMemo(() => categories, [categories]); // 参照の変更を防ぐ

  if (loading) return <div>読み込み中...</div>;
  if (error) return <div>エラー: {error}</div>;

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
      {memoizedCategories.length === 0 ? (
        <p>カテゴリーがありません</p>
      ) : (
        <div>
          {memoizedCategories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      )}
    </div>
  );
}
