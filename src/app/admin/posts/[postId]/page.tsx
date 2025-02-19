"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation"; // useRouter と useParams をインポート
import Input from "@/app/contact/form/Input";
import Label from "@/app/contact/form/Label";
import { Category } from "@/app/_types/post";
import { fetchPostById } from "@/app/lib/prismaApi";

export default function EditPostForm() {
  const params = useParams();
  console.log("params:", params);

  // postIdをparamsから正しく取得
  let postId = params.postId;

  // postIdが配列の場合はjoinで文字列に変換
  if (Array.isArray(postId)) {
    postId = postId.join(""); // 配列の場合、文字列に変換
  }

  console.log("取得したpostId:", postId);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [thumbnailUrl, setThumbnailUrl] = useState<string>("");
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );

  const router = useRouter();

  // Postのデータとカテゴリーデータの取得
  useEffect(() => {
    if (!postId) {
      setError("記事IDが取得できません");
      setLoading(false);
      return;
    }

    // 投稿データの取得
    const loadPost = async () => {
      try {
        console.log(`Fetching post with ID: ${postId}`);
        const data = await fetchPostById(postId);
        console.log("Fetched Post Data:", data);

        // フェッチしたデータをstateにセット
        setTitle(data.title);
        setContent(data.content);
        setThumbnailUrl(data.thumbnailUrl);
        setSelectedCategories(data.categories.map((cat: Category) => cat.id));
      } catch (err) {
        console.error("Error fetching post:", err);
        setError(err instanceof Error ? err.message : "エラーが発生しました");
      } finally {
        setLoading(false);
      }
    };

    // カテゴリーデータを取得
    const loadCategories = async () => {
      try {
        const response = await fetch("/api/admin/categories");
        const data = await response.json();
        setCategories(data.categories);
      } catch (err) {
        console.error("カテゴリーデータ取得に失敗:", err);
      }
    };

    loadPost();
    loadCategories();
  }, [postId]);

  // フォーム送信処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("送信データ:", {
      title,
      content,
      thumbnailUrl,
      categories: selectedCategories,
    });

    const postData = {
      title,
      content,
      thumbnailUrl,
      categories: selectedCategories,
    };

    try {
      console.log(`Sending PUT request for postId: ${postId}`); // 追加されたデバッグログ
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: "PUT", // 更新リクエスト
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      const result = await response.json();
      console.log("更新結果:", result);

      // 成功時に記事一覧ページにリダイレクト
      if (response.ok) {
        console.log("記事更新成功");
        router.replace("/admin/posts"); // 履歴を作らずにページ遷移,ブラウザバック時の404エラー発生対策
      } else {
        console.error("記事更新に失敗:", result.message);
      }
    } catch (error) {
      console.error("更新エラー:", error);
    }
  };

  // 削除処理
  const handleDelete = async () => {
    if (window.confirm("このカテゴリを削除しますか？")) {
      console.log("削除処理を開始します。ポストID:", postId); // 削除リクエスト前にログを表示
      try {
        const response = await fetch(`/api/admin/posts/${postId}`, {
          method: "DELETE",
        });

        const result = await response.json();
        if (response.ok) {
          console.log("記事削除成功");
          router.push("/admin/posts");
        } else {
          console.error("記事削除に失敗:", result.message);
        }
      } catch (error) {
        console.error("削除エラー:", error);
      }
    }
  };

  if (loading) {
    return <div>読み込み中...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="max-w-[800px] mx-auto py-10">
      <h1 className="text-xl font-bold mb-10">記事編集</h1>

      <form onSubmit={handleSubmit}>
        {/* タイトル入力 */}
        <div className="flex flex-col mb-6">
          <Label htmlFor="title">タイトル</Label>
          <Input
            id="title"
            value={title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTitle(e.target.value)
            }
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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setContent(e.target.value)
            }
            placeholder="記事の内容を入力"
          />
        </div>

        {/* サムネイルURL入力 */}
        <div className="flex flex-col mb-6">
          <Label htmlFor="thumbnailUrl">サムネイルURL</Label>
          <Input
            id="thumbnailUrl"
            value={thumbnailUrl}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setThumbnailUrl(e.target.value)
            }
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
            value={selectedCategories.map(String)} // 数値配列を文字列配列に変換
            onChange={(e) => {
              const selectedOptions = Array.from(
                e.target.selectedOptions,
                (option) => Number(option.value)
              );
              setSelectedCategories(selectedOptions); // 選択されたカテゴリIDを更新
            }}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* 更新ボタン */}
        <div className="flex justify-center mt-10">
          <button
            type="submit"
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg"
          >
            更新
          </button>

          {/* 削除ボタン */}
          <button
            type="button"
            onClick={handleDelete} // 削除ボタンがクリックされたらhandleDeleteを実行
            className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg"
          >
            削除
          </button>
        </div>
      </form>
    </div>
  );
}
