"use client";

import { useState } from "react";

type Props = {
  initialName?: string; // 初期カテゴリ名（編集ページ用）
  categoryId?: string; // 編集ページでカテゴリIDが必要
  onSubmit: (name: string) => void; // フォーム送信時の処理
  buttonText: string; // ボタンのテキスト
  isLoading: boolean; // ローディング状態
  error: string | null; // エラーメッセージ
  onDelete?: () => void; // 削除ボタンの処理（オプション）
};

const CategoryForm: React.FC<Props> = ({
  initialName = "",
  categoryId,
  onSubmit,
  buttonText,
  isLoading,
  error,
  onDelete,
}) => {
  const [name, setName] = useState<string>(initialName);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(name); // onSubmitが親コンポーネントに渡された処理を実行
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{buttonText}</h1>

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
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />

        {/* 送信ボタン */}
        <button
          type="submit"
          className="mr-4 mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={isLoading} // ローディング中はボタンを無効化
        >
          {isLoading ? "作成中..." : buttonText}
        </button>
        {/* 削除ボタン（categoryIdがある場合のみ表示） */}
        {categoryId && onDelete && (
          <button
            onClick={onDelete}
            className="mr-4 mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            disabled={isLoading}
          >
            削除
          </button>
        )}
      </form>
    </div>
  );
};

export default CategoryForm;
