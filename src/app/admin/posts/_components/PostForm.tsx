"use client";

import { useState, useEffect } from "react";
import Input from "@/app/contact/form/Input";
import Label from "@/app/contact/form/Label";
import { Post } from "@/app/_types/post";
import { Category } from "@/app/_types/category";

type PostFormProps = {
  initialData?: Post;
  onSubmit: (postData: {
    title: string;
    content: string;
    thumbnailUrl: string;
    categories: number[];
  }) => void;
  onDelete?: () => void;
  buttonText: string;
  isLoading: boolean;
};

const PostForm: React.FC<PostFormProps> = ({
  initialData = {
    title: "",
    content: "",
    thumbnailUrl: "",
  },
  onSubmit,
  onDelete, // 🔥 ここで onDelete を追加
  buttonText,
  isLoading,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState(initialData.title);
  const [content, setContent] = useState(initialData.content);
  const [thumbnailUrl, setThumbnailUrl] = useState(initialData.thumbnailUrl);
  const [selectedCategories, setSelectedCategories] = useState<number[]>(
    initialData.categories?.map((category) => category.id) || []
  );

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/admin/categories");

        if (!response.ok) {
          throw new Error("カテゴリの取得に失敗しました");
        }

        const data = await response.json();
        setCategories(data.categories);
      } catch (error) {
        console.error("カテゴリデータ取得エラー:", error);
      }
    };

    fetchCategories();
  }, []);

  // フォーム送信
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({ title, content, thumbnailUrl, categories: selectedCategories });
  };

  // 入力フィールドの変更処理
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    if (id === "title") setTitle(value);
    if (id === "content") setContent(value);
    if (id === "thumbnailUrl") setThumbnailUrl(value);
  };

  // カテゴリ選択
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategories(
      Array.from(e.target.selectedOptions, (option) => Number(option.value))
    );
  };

  return (
    <div className="max-w-[800px] mx-auto py-10">
      <h1 className="text-xl font-bold mb-10">{buttonText}</h1>

      <form onSubmit={handleSubmit}>
        {/* タイトル入力 */}
        <div className="flex flex-col mb-6">
          <Label htmlFor="title">タイトル</Label>
          <Input
            id="title"
            value={title}
            onChange={handleInputChange}
            placeholder="記事のタイトルを入力"
          />
        </div>

        {/* 内容入力 */}
        <div className="flex flex-col mb-6">
          <Label htmlFor="content">内容</Label>
          <Input
            id="content"
            as="textarea"
            rows={8}
            value={content}
            onChange={handleInputChange}
            placeholder="記事の内容を入力"
          />
        </div>

        {/* サムネイルURL */}
        <div className="flex flex-col mb-6">
          <Label htmlFor="thumbnailUrl">サムネイルURL</Label>
          <Input
            id="thumbnailUrl"
            value={thumbnailUrl}
            onChange={handleInputChange}
            placeholder="サムネイル画像のURLを入力"
          />
        </div>

        {/* カテゴリ選択 */}
        <div className="flex flex-col mb-6">
          <Label htmlFor="categories">カテゴリー</Label>
          <select
            id="categories"
            multiple
            className="p-2 border rounded-lg"
            value={selectedCategories.map(String)}
            onChange={handleCategoryChange}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* ボタン */}
        <div className="flex justify-center mt-10">
          <button
            type="submit"
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg"
            disabled={isLoading}
          >
            {isLoading ? "処理中..." : buttonText}
          </button>

          {/* 削除ボタン（編集時のみ表示） */}
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg ml-4"
              disabled={isLoading}
            >
              削除
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default PostForm;
