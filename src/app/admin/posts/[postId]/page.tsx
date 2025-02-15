"use client";

import { useState, useEffect } from "react";
import Input from "@/app/contact/form/Input";
import Label from "@/app/contact/form/Label";

interface PostData {
  id: number;
  title: string;
  content: string;
  thumbnailUrl: string;
  categories: { id: number; name: string }[];
}

const EditPostForm: React.FC = function EditPostForm() {
  const [post, setPost] = useState<PostData | null>(null);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );

  useEffect(() => {
    // 記事データを取得（ダミーデータ）
    const fetchPost = async () => {
      const dummyPost = {
        id: 1,
        title: "サンプル記事タイトル",
        content: "サンプル記事の内容",
        thumbnailUrl: "https://via.placeholder.com/150",
        categories: [
          { id: 1, name: "JavaScript" },
          { id: 3, name: "Rust" },
        ],
      };
      setPost(dummyPost);
    };

    // カテゴリーデータを取得（ダミーデータ）
    const fetchCategories = async () => {
      const dummyCategories = [
        { id: 1, name: "JavaScript" },
        { id: 2, name: "Go" },
        { id: 3, name: "Rust" },
      ];
      setCategories(dummyCategories);
    };

    fetchPost();
    fetchCategories();
  }, []);

  // 記事データがまだ読み込まれていない場合はローディング表示
  if (!post) {
    return <div>読み込み中...</div>;
  }

  return (
    <div className="max-w-[800px] mx-auto py-10">
      <h1 className="text-xl font-bold mb-10">記事編集</h1>

      <form>
        {/* タイトル */}
        <div className="flex flex-col mb-6">
          <Label htmlFor="title">タイトル</Label>
          <Input
            id="title"
            defaultValue={post.title}
            placeholder="記事のタイトルを入力"
          />
        </div>

        {/* コンテンツ */}
        <div className="flex flex-col mb-6">
          <Label htmlFor="content">内容</Label>
          <Input
            id="content"
            as="textarea"
            rows={8}
            defaultValue={post.content}
            placeholder="記事の内容を入力"
          />
        </div>

        {/* サムネイルURL */}
        <div className="flex flex-col mb-6">
          <Label htmlFor="thumbnailUrl">サムネイルURL</Label>
          <Input
            id="thumbnailUrl"
            defaultValue={post.thumbnailUrl}
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
            defaultValue={post.categories.map((category) =>
              category.id.toString()
            )}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* 更新ボタンと削除ボタン */}
        <div className="flex justify-center mt-10">
          <button
            type="submit"
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg mr-4"
          >
            更新
          </button>
          <button
            type="button"
            onClick={() => console.log("記事削除")}
            className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg"
          >
            削除
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPostForm;
