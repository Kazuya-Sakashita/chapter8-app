"use client";

import { useRouter, useParams } from "next/navigation";
import PostForm from "../_components/PostForm";
import { useAdminPostById } from "../_hooks/useAdminPosts";
import {
  useUpdateAdminPost,
  useDeleteAdminPost,
} from "../_hooks/useMutateAdminPosts";

export default function EditPostPage() {
  const params = useParams();
  const router = useRouter();

  const postId = Array.isArray(params.postId)
    ? params.postId.join("")
    : params.postId;

  const { post, isError, isLoading, mutate } = useAdminPostById(postId);
  const { updatePost } = useUpdateAdminPost();
  const { deletePost } = useDeleteAdminPost();

  const handleUpdatePost = async (postData: {
    title: string;
    content: string;
    thumbnailUrl: string;
    categories: number[];
  }) => {
    console.log("更新前の postData:", postData); // ✅ デバッグ用

    try {
      const updatedPost = await updatePost(postId, postData);
      console.log("記事更新成功:", updatedPost); // ✅ 更新後のレスポンス

      await mutate();
      await mutate("/api/posts");

      router.replace("/admin/posts");
    } catch (error) {
      console.error("記事更新エラー:", error);
    }
  };

  const handleDeletePost = async () => {
    if (!confirm("この記事を削除しますか？")) return;
    try {
      await deletePost(postId);
      await mutate("/api/posts");

      router.push("/admin/posts");
    } catch (error) {
      console.error("記事削除エラー:", error);
    }
  };

  if (isLoading) return <div>読み込み中...</div>;
  if (isError)
    return <div className="text-red-500">記事の取得に失敗しました</div>;
  if (!post) return <div>記事が見つかりません</div>;

  return (
    <PostForm
      initialData={post}
      onSubmit={handleUpdatePost}
      onDelete={handleDeletePost}
      buttonText="記事を更新"
      isLoading={isLoading}
    />
  );
}
