"use client";

import Link from "next/link";
import PostCard from "./posts/_components/PostCard";
import { useEffect, useState } from "react";
import { fetchPosts } from "./lib/microCmsApi";
import { MicroCmsPost } from "./_types/MicroCmsPost";

export default function PostsPage() {
  const [posts, setPosts] = useState<MicroCmsPost[]>([]);
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
        {posts.map((post) => (
          <Link href={`/posts/${post.id}`} key={post.id}>
            <PostCard post={post} />
          </Link>
        ))}
      </main>
    </div>
  );
}
