"use client";

import { useRouter, useParams } from "next/navigation";
import PostForm from "../_components/PostForm";
import { usePostById, useUpdatePost, useDeletePost } from "@/app/lib/swrApi";
import { useSWRConfig } from "swr";

export default function EditPostPage() {
  const params = useParams();
  const router = useRouter();
  const { mutate } = useSWRConfig(); // SWR のグローバル mutate を取得

  const postId = Array.isArray(params.postId)
    ? params.postId.join("")
    : params.postId;
  const { post, isLoading, isError, mutate: mutatePost } = usePostById(postId);
  const { updatePost } = useUpdatePost();
  const { deletePost } = useDeletePost();

  // 記事更新処理
  const handleUpdatePost = async (postData: {
    title: string;
    content: string;
    thumbnailUrl: string;
    categories: number[];
  }) => {
    try {
      const updatedPost = await updatePost(postId, postData);
      console.log("記事更新成功:", updatedPost);

      // SWR の `mutate()` を使用し、データの即時更新
      await mutatePost({ post: updatedPost.post }, false);
      await mutate("/api/posts"); // 記事一覧のキャッシュも更新

      router.replace("/admin/posts");
    } catch (error) {
      console.error("更新エラー:", error);
    }
  };

  // 記事削除処理
  const handleDeletePost = async () => {
    if (!confirm("この記事を削除しますか？")) return;
    try {
      await deletePost(postId);
      await mutate("/api/posts"); // 記事一覧のキャッシュを更新

      router.push("/admin/posts");
    } catch (error) {
      console.error("削除エラー:", error);
    }
  };

  if (isLoading) return <div>読み込み中...</div>;
  if (isError)
    return <div className="text-red-500">記事の取得に失敗しました</div>;
  if (!post) return <div>記事が見つかりません</div>;

  return (
    <PostForm
      initialData={post}
      onSubmit={handleUpdatePost} // ✅ onSubmit を渡す
      onDelete={handleDeletePost} // ✅ onDelete を渡す
      buttonText="記事を更新"
      isLoading={isLoading}
    />
  );
}
