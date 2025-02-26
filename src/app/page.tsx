"use client";

import Link from "next/link";
import PostCard from "./posts/_components/PostCard";
import { usePosts } from "./posts/_hooks/usePosts";
import { Post } from "./_types/post"; // 型をインポート

export default function PostsPage() {
  const { posts, isLoading, isError } = usePosts();

  if (isLoading) return <div>読み込み中...</div>;
  if (isError) return <div>エラーが発生しました</div>;

  return (
    <div>
      <main className="container mx-auto p-4">
        {(posts || []).map((post: Post) => (
          <Link href={`/posts/${post.id}`} key={post.id}>
            <PostCard post={post} />
          </Link>
        ))}
      </main>
    </div>
  );
}
