"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateCategoryPage() {
  const [name, setName] = useState(""); // カテゴリ名
  const [error, setError] = useState<string | null>(null); // エラーメッセージ
  const [loading, setLoading] = useState(false); // ローディング状態
  const router = useRouter();

  // フォーム送信処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // ローディング開始
    setError(null); // エラーメッセージのリセット

    console.log("カテゴリ作成フォームが送信されました");

    try {
      console.log("送信データ:", { name });

      // APIリクエストを送信
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      console.log("レスポンスステータス:", response.status);

      const result = await response.json();
      console.log("レスポンス内容:", result);

      // エラーが発生した場合
      if (!response.ok) {
        console.error(
          "エラーメッセージ:",
          result.status || "カテゴリの作成に失敗しました"
        );
        throw new Error(result.status || "カテゴリの作成に失敗しました");
      }

      // 成功した場合
      console.log("カテゴリ作成成功、リダイレクト中...");
      router.push("/admin/categories"); // 一覧ページへリダイレクト
      router.refresh(); // リストを更新
    } catch (err) {
      // エラー発生時
      setError(
        err instanceof Error ? err.message : "不明なエラーが発生しました"
      );
      console.error("送信エラー:", err);
    } finally {
      setLoading(false); // ローディング終了
      console.log("処理が完了しました");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">カテゴリを作成</h1>

      {/* エラーメッセージ */}
      {error && <p className="text-red-500">{error}</p>}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 border rounded-lg shadow-md"
      >
        {/* カテゴリ名入力フィールド */}
        <label className="block mb-2 font-bold">カテゴリ名</label>
        <input
          type="text"
          value={name}
          onChange={(e) => {
            console.log("カテゴリ名入力中:", e.target.value); // 入力内容をログに出力
            setName(e.target.value);
          }}
          className="w-full p-2 border rounded"
          required
        />

        {/* 送信ボタン */}
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={loading} // ローディング中はボタンを無効化
        >
          {loading ? "作成中..." : "カテゴリを作成"} {/* ボタンテキスト */}
        </button>
      </form>
    </div>
  );
}
