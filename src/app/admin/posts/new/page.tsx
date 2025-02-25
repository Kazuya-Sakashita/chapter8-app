"use client";

import { useRouter } from "next/navigation";
import PostForm from "../_components/PostForm";

export default function CreatePostPage() {
  const router = useRouter();

  const handleCreatePost = async (postData: {
    title: string;
    content: string;
    thumbnailUrl: string;
    categories: number[];
  }) => {
    try {
      const response = await fetch("/api/admin/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });

      if (!response.ok) throw new Error("記事の作成に失敗しました");

      router.push("/admin/posts");
    } catch (error) {
      console.error("送信エラー:", error);
    }
  };

  return <PostForm onSubmit={handleCreatePost} buttonText="記事を作成" />;
}
