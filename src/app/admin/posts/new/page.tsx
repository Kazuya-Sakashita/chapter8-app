"use client";

import { useRouter } from "next/navigation";
import PostForm from "../_components/PostForm";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";

export default function CreatePostPage() {
  const router = useRouter();
  const { token } = useSupabaseSession();
  console.log("今取得したトークン:", token); // トークンの値を確認

  const handleCreatePost = async (postData: {
    title: string;
    content: string;
    thumbnailImageKey: string;
    categories: number[];
  }) => {
    try {
      console.log("送信するヘッダー:", {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      });

      const response = await fetch("/api/admin/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "", // token が無い場合には空文字を渡す
        },
        body: JSON.stringify(postData),
      });

      console.log("送信されるリクエストヘッダー:", {
        Authorization: token ? `Bearer ${token}` : "",
      });

      if (!response.ok) throw new Error("記事の作成に失敗しました");

      router.push("/admin/posts");
    } catch (error) {
      console.error("送信エラー:", error);
    }
  };

  return <PostForm onSubmit={handleCreatePost} buttonText="記事を作成" />;
}
