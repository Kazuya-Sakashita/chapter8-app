"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import PostForm from "../_components/PostForm";
import { fetchPostById } from "@/app/lib/prismaApi";
import { Post } from "@/app/_types/post";
import { Category } from "@/app/_types/category";

export default function EditPostPage() {
  const params = useParams();
  const router = useRouter();
  const postId = Array.isArray(params.postId)
    ? params.postId.join("")
    : params.postId;

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [initialData, setInitialData] = useState<Post | null>(null);

  useEffect(() => {
    if (!postId) {
      setError("記事IDが取得できません");
      setLoading(false);
      return;
    }

    const loadPost = async () => {
      try {
        const data = await fetchPostById(postId);
        setInitialData({
          id: data.id,
          title: data.title,
          content: data.content,
          thumbnailUrl: data.thumbnailUrl,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          categories: data.categories.map((cat: Category) => ({
            id: cat.id,
            name: cat.name,
          })), // `selectedCategories` ではなく `categories` に変換
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "エラーが発生しました");
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [postId]);

  const handleUpdatePost = async (postData: {
    title: string;
    content: string;
    thumbnailUrl: string;
    categories: number[];
  }) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });

      if (!response.ok) throw new Error("記事の更新に失敗しました");

      router.replace("/admin/posts");
    } catch (error) {
      console.error("更新エラー:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async () => {
    if (!confirm("この記事を削除しますか？")) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("記事の削除に失敗しました");

      router.push("/admin/posts");
    } catch (error) {
      console.error("削除エラー:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>読み込み中...</div>;
  if (error) return <div>{error}</div>;
  if (!initialData) return <div>記事が見つかりません</div>; // 初期データが `null` の場合の対処

  return (
    <PostForm
      initialData={initialData} // `categories` を渡す
      onSubmit={handleUpdatePost}
      onDelete={handleDeletePost}
      buttonText="記事を更新"
      isLoading={loading}
    />
  );
}
