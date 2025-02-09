"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import PostCard from "../_components/PostCard";
import { fetchPostById } from "../../lib/microCmsApi"; // 共通APIを使用
import { MicroCmsPost } from "@/app/_types/MicroCmsPost";

export default function PostDetail() {
  const params = useParams();
  console.log("params:", params);

  let postId = params.id || params.postId; // `id` or `postId`

  // `postId` を `string` に変換（`string[]` の可能性を考慮）
  if (Array.isArray(postId)) {
    postId = postId.join("");
  }

  const [post, setPost] = useState<MicroCmsPost | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!postId) {
      setError("記事IDが取得できません");
      setLoading(false);
      return;
    }

    const loadPost = async () => {
      try {
        console.log(`Fetching post with ID: ${postId}`);
        const data = await fetchPostById(postId); // 修正: `postId` を渡す
        setPost(data);
      } catch (err) {
        console.error("Error fetching post:", err);
        setError(err instanceof Error ? err.message : "エラーが発生しました");
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [postId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">エラー: {error}</p>;
  if (!post) return <p>記事が見つかりません</p>;

  return (
    <div className="container mx-auto p-4">
      {/* サムネイル画像 */}
      <div className="relative w-full h-60">
        <Image
          src={post.thumbnail?.url || "/default-thumbnail.jpg"} // 修正: `post.thumbnail?.url` を使用
          alt={post.title}
          fill
          className="object-cover rounded-lg"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority={true}
        />
      </div>

      {/* 本文 */}
      <div className="container mx-auto p-4">
        <PostCard post={post} isDetail={true} />
      </div>
    </div>
  );
}
