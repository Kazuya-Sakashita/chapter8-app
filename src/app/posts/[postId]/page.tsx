"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import PostCard from "../_components/PostCard";
import { fetchPostById } from "../../lib/prismaApi";
import { Post } from "@/app/_types/post";
import { supabase } from "@/utils/supabase"; // Supabaseインスタンスをインポート

export default function PostDetail() {
  const params = useParams();
  console.log("params:", params);

  let postId = params.id || params.postId;

  if (Array.isArray(postId)) {
    postId = postId.join("");
  }

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [thumbnailImageUrl, setThumbnailImageUrl] = useState<string | null>(
    null
  ); // 画像URLのstate

  useEffect(() => {
    if (!postId) {
      setError("記事IDが取得できません");
      setLoading(false);
      return;
    }

    const loadPost = async () => {
      try {
        console.log(`Fetching post with ID: ${postId}`);
        const data = await fetchPostById(postId);
        console.log("Fetched Post Data:", data);

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

  // 画像URLを取得する処理
  useEffect(() => {
    if (!post || !post.thumbnailImageKey) return;

    const fetchImageUrl = async () => {
      const { data } = await supabase.storage
        .from("post_thumbnail")
        .getPublicUrl(post.thumbnailImageKey); // publicUrlを取得

      if (!data?.publicUrl) {
        console.error("画像URLの取得に失敗しました");
        return;
      }

      setThumbnailImageUrl(data.publicUrl); // 取得したURLをstateに設定
    };

    fetchImageUrl();
  }, [post]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">エラー: {error}</p>;
  if (!post) return <p>記事が見つかりません</p>;

  console.log("Post Data:", post);
  console.log("サムネイルURL:", thumbnailImageUrl); // 修正した変数でログ出力

  return (
    <div className="container mx-auto p-4">
      {/* サムネイル画像 */}
      <div className="relative w-full h-60">
        <Image
          src={thumbnailImageUrl || "/default-thumbnail.jpg"} // 取得したURLを使用
          alt={post.title}
          layout="fill" // 親コンテナに合わせて画像をフィットさせる
          objectFit="contain" // 画像が親コンテナに収まるように調整
          className="rounded-lg"
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
