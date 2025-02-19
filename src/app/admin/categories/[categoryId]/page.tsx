"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation"; // useParams を next/navigation からインポート

export default function EditCategoryPage() {
  const [name, setName] = useState<string | null>(null); // 初期値を null に変更
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { categoryId } = useParams(); // useParams から categoryId を取得

  useEffect(() => {
    // カテゴリ情報を取得
    const fetchCategory = async () => {
      if (!categoryId) return;
      try {
        const response = await fetch(`/api/admin/categories/${categoryId}`); // IDを基にカテゴリデータを取得
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "カテゴリの取得に失敗しました");
        }

        console.log("取得したカテゴリ名:", data.category.name);

        // フォームにカテゴリ名をセット
        setName(data.category.name || ""); // データが存在しない場合、空文字にセット
      } catch (err) {
        // エラーがあればエラーメッセージを表示
        console.error("エラーが発生しました:", err);
        setError("カテゴリデータの取得に失敗しました");
      }
    };

    fetchCategory();
  }, [categoryId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }), // 更新するカテゴリ名
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "カテゴリの更新に失敗しました");
      }

      // カテゴリ更新成功後、一覧ページにリダイレクト
      router.push("/admin/categories");
      router.refresh(); // リストを最新の状態に更新
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "不明なエラーが発生しました"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("このカテゴリを削除しますか？")) {
      try {
        const response = await fetch(`/api/admin/categories/${categoryId}`, {
          method: "DELETE", // カテゴリ削除のリクエスト
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "カテゴリの削除に失敗しました");
        }

        // カテゴリ削除成功後、一覧ページにリダイレクト
        router.push("/admin/categories");
        router.refresh(); // リストを最新の状態に更新
      } catch (err) {
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

      {error && <p className="text-red-500">{error}</p>}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 border rounded-lg shadow-md"
      >
        {/* カテゴリ名 */}
        <label className="block mb-2 font-bold">カテゴリ名</label>
        <input
          type="text"
          value={name} // フォームにカテゴリ名を表示
          onChange={(e) => setName(e.target.value)} // 入力時にステートを更新
          className="w-full p-2 border rounded mb-4"
          required
          disabled={loading} // ローディング中はフォームを操作できないようにする
        />

        {/* 送信ボタン */}
        <div className="flex  mt-10">
          <button
            type="submit"
            className="py-3 px-6 bg-blue-500 text-white font-bold rounded-lg"
            disabled={loading} // ローディング中はボタンを無効化
          >
            {loading ? "更新中..." : "更新"}
          </button>
          <button
            type="button"
            onClick={handleDelete} // 削除ボタンの処理を実行
            className="ml-2 py-3 px-6 font-bold text-white bg-red-500 hover:bg-red-600 rounded-lg shadow-lg transition-all"
            disabled={loading} // ローディング中はボタンを無効化
          >
            削除
          </button>
        </div>
      </form>
    </div>
  );
}
