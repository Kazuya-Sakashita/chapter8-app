"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation"; // useParams を next/navigation からインポート
import CategoryForm from "@/app/admin/categories/_components/CategoryForm"; // CategoryFormをインポート

export default function EditCategoryPage() {
  const [name, setName] = useState<string | null>(null); // 初期値を null に変更
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { categoryId } = useParams(); // useParams から categoryId を取得
  const categoryIdString = Array.isArray(categoryId)
    ? categoryId[0]
    : categoryId; // 配列の場合は最初の要素を使う

  useEffect(() => {
    // カテゴリ情報を取得
    const fetchCategory = async () => {
      if (!categoryId) return;
      try {
        console.log(`カテゴリ情報取得中: ${categoryId}`); // デバッグログ
        const response = await fetch(`/api/admin/categories/${categoryId}`); // IDを基にカテゴリデータを取得
        const data = await response.json();

        if (!response.ok) {
          console.error("エラー: カテゴリの取得に失敗", data.message);
          throw new Error(data.message || "カテゴリの取得に失敗しました");
        }

        console.log("取得したカテゴリ名:", data.category.name);

        // フォームにカテゴリ名をセット
        setName(data.category.name || ""); // データが存在しない場合、空文字にセット
      } catch (err) {
        console.error("カテゴリデータの取得に失敗:", err);
        setError("カテゴリデータの取得に失敗しました");
      }
    };

    fetchCategory();
  }, [categoryId]);

  const handleSubmit = async (name: string) => {
    setLoading(true);
    setError(null);

    console.log("カテゴリ更新処理開始:", name); // デバッグログ

    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }), // 更新するカテゴリ名
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("カテゴリ更新エラー:", result.message);
        throw new Error(result.message || "カテゴリの更新に失敗しました");
      }

      console.log("カテゴリ更新成功:", result);

      // カテゴリ更新成功後、一覧ページにリダイレクト
      router.push("/admin/categories");
      router.refresh(); // リストを最新の状態に更新
    } catch (err) {
      console.error("カテゴリ更新に失敗:", err);
      setError(
        err instanceof Error ? err.message : "不明なエラーが発生しました"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("このカテゴリを削除しますか？")) {
      console.log("カテゴリ削除処理開始:", categoryIdString); // デバッグログ

      try {
        const response = await fetch(`/api/admin/categories/${categoryId}`, {
          method: "DELETE", // カテゴリ削除のリクエスト
        });

        const result = await response.json();

        if (!response.ok) {
          console.error("カテゴリ削除エラー:", result.message);
          throw new Error(result.message || "カテゴリの削除に失敗しました");
        }

        console.log("カテゴリ削除成功:", result);

        // カテゴリ削除成功後、一覧ページにリダイレクト
        router.push("/admin/categories");
        router.refresh(); // リストを最新の状態に更新
      } catch (err) {
        console.error("削除中にエラー発生:", err);
        setError(
          err instanceof Error ? err.message : "削除中にエラーが発生しました"
        );
      }
    }
  };

  if (name === null) {
    // カテゴリ情報をまだ取得していない場合にローディング表示
    return <div>読み込み中...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">カテゴリ編集</h1>

      {/* エラーメッセージ */}
      {error && <p className="text-red-500">{error}</p>}

      {/* CategoryFormを使って編集フォームを表示 */}
      <CategoryForm
        initialName={name}
        categoryId={categoryIdString} // 編集ページなのでcategoryIdを渡す
        onSubmit={handleSubmit}
        buttonText="更新"
        isLoading={loading}
        error={error}
        onDelete={handleDelete} // 削除ボタンの処理を渡す
      />
    </div>
  );
}
