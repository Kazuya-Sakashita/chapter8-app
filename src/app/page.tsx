"use client";

import Link from "next/link";
import PostCard from "./posts/_components/PostCard";
import { useEffect, useState } from "react";
import { Post } from "./types/post";

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // データの取得開始
        const response = await fetch(
          "https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev/posts"
        );

        // レスポンスがエラーの場合は例外をスロー
        if (!response.ok) {
          throw new Error("データの取得に失敗しました");
        }

        const data = await response.json();
        setPosts(data.posts); // データをステートに保存
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message); // エラーメッセージをステートに保存
        } else {
          setError("不明なエラーが発生しました"); // エラーが Error インスタンスでない場合の対応
        }
      } finally {
        setLoading(false); // 読み込み中の状態を解除
      }
    };
    fetchPosts();
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
        {posts.map((post) => (
          <Link href={`/posts/${post.id}`} key={post.id}>
            <PostCard key={post.id} post={post} />
          </Link>
        ))}
      </main>
    </div>
  );
}
