"use client";

import { useState, useEffect } from "react";
import Input from "@/app/contact/form/Input";
import Label from "@/app/contact/form/Label";

const PostForm: React.FC = function PostForm() {
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );

  useEffect(() => {
    // カテゴリーデータを取得（ダミーデータの代わり）
    const fetchCategories = async () => {
      // APIからのデータ取得部分（ダミーデータを使用）
      const dummyCategories = [
        { id: 1, name: "JavaScript" },
        { id: 2, name: "Go" },
        { id: 3, name: "Rust" },
      ];
      setCategories(dummyCategories);
    };

    fetchCategories();
  }, []);

  // TODO クリアボタンでフォーム内を消すように追加
  // TODO カテゴリー選択を複数できるようにする

  return (
    <div className="max-w-[800px] mx-auto py-10">
      <h1 className="text-xl font-bold mb-10">記事作成</h1>

      <form>
        {/* タイトル */}
        <div className="flex flex-col mb-6">
          <Label htmlFor="title">タイトル</Label>
          <Input id="title" placeholder="記事のタイトルを入力" />
        </div>

        {/* コンテンツ */}
        <div className="flex flex-col mb-6">
          <Label htmlFor="content">内容</Label>
          <Input
            id="content"
            as="textarea"
            rows={8}
            placeholder="記事の内容を入力"
          />
        </div>

        {/* サムネイルURL */}
        <div className="flex flex-col mb-6">
          <Label htmlFor="thumbnailUrl">サムネイルURL</Label>
          <Input id="thumbnailUrl" placeholder="サムネイル画像のURLを入力" />
        </div>

        {/* カテゴリ選択 */}
        <div className="flex flex-col mb-6">
          <Label htmlFor="categories">カテゴリー</Label>
          <select id="categories" multiple className="p-2 border rounded-lg">
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
            onClick={() => console.log("フォームリセット")}
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
