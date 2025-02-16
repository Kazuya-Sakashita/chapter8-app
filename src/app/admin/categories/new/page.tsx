"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateCategoryPage() {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.status || "カテゴリの作成に失敗しました");
      }

      // カテゴリ作成成功後、一覧ページへリダイレクト
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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">カテゴリを作成</h1>

      {error && <p className="text-red-500">{error}</p>}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 border rounded-lg shadow-md"
      >
        <label className="block mb-2 font-bold">カテゴリ名</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />

        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "作成中..." : "カテゴリを作成"}
        </button>
      </form>
    </div>
  );
}
