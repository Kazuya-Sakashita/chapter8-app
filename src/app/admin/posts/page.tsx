"use client";

import { useEffect, useState } from "react";
import { fetchPosts } from "../../lib/prismaApi";
import { Post } from "../../_types/post";
import AdminPostCard from "./_components/AdminPostCard";

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await fetchPosts(); // 共通関数を利用
        setPosts(data);
        console.log(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("不明なエラーが発生しました");
        }
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  if (loading) {
    return <div>読み込み中...</div>;
  }

  if (error) {
    return <div>エラー: {error}</div>; // エラーメッセージを表示
  }

  return (
    <div>
      <main className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-14">
          <h2 className="text-3xl">記事一覧</h2>
          <button className="bg-blue-500 text-white hover:bg-blue-700 font-bold py-2 px-4 rounded">
            新規作成
          </button>
        </div>
        {posts.map((post) => (
          <AdminPostCard post={post} key={post.id} />
        ))}
      </main>
    </div>
  );
}
