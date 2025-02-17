"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Input from "@/app/contact/form/Input";
import Label from "@/app/contact/form/Label";

const PostForm: React.FC = function PostForm() {
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );
  const [title, setTitle] = useState(""); // タイトル
  const [content, setContent] = useState(""); // 内容
  const [thumbnailUrl, setThumbnailUrl] = useState(""); // サムネイルURL
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]); // 数値型のカテゴリIDを使用
  const router = useRouter(); // useRouterフックを使用

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/admin/categories");

        if (!response.ok) {
          throw new Error("カテゴリの取得に失敗しました");
        }

        const data = await response.json();
        setCategories(data.categories); // カテゴリーデータをセット
      } catch (error) {
        console.error("カテゴリデータ取得エラー:", error);
      }
    };

    fetchCategories();
  }, []); // 初回レンダリング時に実行

  // フォームのリセット
  const handleClear = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setTitle("");
    setContent("");
    setThumbnailUrl("");
    setSelectedCategories([]); // 選択されたカテゴリもリセット
  };

  // フォーム送信処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const postData = {
      title,
      content,
      thumbnailUrl,
      categories: selectedCategories, // 数値のカテゴリIDを送信
    };

    try {
      const response = await fetch("/api/admin/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "記事の作成に失敗しました");
      }

      // 記事作成成功後、記事一覧ページへリダイレクト
      router.push("/admin/posts"); // 記事一覧ページにリダイレクト
    } catch (error) {
      console.error("送信エラー:", error);
    }
  };

  // カテゴリ選択のトグル
  const handleCategoryToggle = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) =>
      Number(option.value)
    );
    setSelectedCategories(selectedOptions);
  };

  return (
    <div className="max-w-[800px] mx-auto py-10">
      <h1 className="text-xl font-bold mb-10">記事作成</h1>

      <form onSubmit={handleSubmit}>
        {/* タイトル入力フィールド */}
        <div className="flex flex-col mb-6">
          <Label htmlFor="title">タイトル</Label>
          <Input
            id="title"
            placeholder="記事のタイトルを入力"
            value={title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setTitle(e.target.value);
            }} // タイトルの変更
          />
        </div>

        {/* 内容入力フィールド */}
        <div className="flex flex-col mb-6">
          <Label htmlFor="content">内容</Label>
          <Input
            id="content"
            as="textarea"
            rows={8}
            placeholder="記事の内容を入力"
            value={content}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setContent(e.target.value);
            }} // 内容の変更
          />
        </div>

        {/* サムネイルURL入力フィールド */}
        <div className="flex flex-col mb-6">
          <Label htmlFor="thumbnailUrl">サムネイルURL</Label>
          <Input
            id="thumbnailUrl"
            placeholder="サムネイル画像のURLを入力"
            value={thumbnailUrl}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setThumbnailUrl(e.target.value);
            }} // サムネイルURLの変更
          />
        </div>

        {/* カテゴリ選択（プルダウンで複数選択） */}
        <div className="flex flex-col mb-6">
          <Label htmlFor="categories">カテゴリー</Label>
          <select
            id="categories"
            value={selectedCategories.map(String)} // 数値配列を文字列配列に変換
            onChange={handleCategoryToggle} // プルダウン選択変更時にトグル処理
            multiple
            className="p-2 border rounded-lg"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* 送信ボタン */}
        <div className="flex justify-center mt-10">
          <button
            type="submit"
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg mr-4"
          >
            作成
          </button>
          <button
            type="button"
            onClick={handleClear} // フォームをクリア
            className="py-3 px-6 font-bold text-gray-800 bg-gray-200 hover:bg-gray-300 rounded-lg shadow-lg transition-all"
          >
            クリア
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostForm;
