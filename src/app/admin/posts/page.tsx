"use client";

import { usePosts } from "@/app/lib/swrApi";
import AdminPostCard from "./_components/AdminPostCard";
import Link from "next/link";

export default function PostsPage() {
  const { posts, isLoading, isError } = usePosts();

  if (isLoading) {
    return <div>読み込み中...</div>;
  }

  if (isError) {
    return (
      <div className="text-red-500">エラー: データの取得に失敗しました</div>
    );
  }
  return (
    <div>
      <main className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-14">
          <h2 className="text-3xl">記事一覧</h2>
          <Link href="/admin/posts/new">
            <button className="bg-blue-500 text-white hover:bg-blue-700 font-bold py-2 px-4 rounded">
              新規作成
            </button>
          </Link>
        </div>
        {posts.map((post) => (
          <AdminPostCard post={post} key={post.id} />
        ))}
      </main>
    </div>
  );
}
