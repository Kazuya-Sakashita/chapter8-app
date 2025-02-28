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

  // URLパラメータから postId を取得
  const postId = Array.isArray(params.postId)
    ? params.postId.join("")
    : params.postId;

  // 記事データを取得
  const { post, isError, isLoading, mutate } = useAdminPostById(postId);
  const { updatePost } = useUpdateAdminPost();
  const { deletePost } = useDeleteAdminPost();

  // 記事更新処理
  const handleUpdatePost = async (postData: {
    title: string;
    content: string;
    thumbnailImageKey: string;
    categories: number[];
  }) => {
    console.log("更新前の postData:", postData); // デバッグ用

    try {
      const updatedPost = await updatePost(postId, postData);
      console.log("記事更新成功:", updatedPost);

      await mutate(); // このコンポーネントで利用しているデータのみを更新
      router.replace("/admin/posts"); // 更新後は一覧ページへ
    } catch (error) {
      console.error("記事更新エラー:", error);
    }
  };

  // 記事削除処理
  const handleDeletePost = async () => {
    if (!confirm("この記事を削除しますか？")) return;
    try {
      await deletePost(postId);

      // 削除後はすぐにリダイレクトし、無駄なリクエストを防ぐ
      router.replace("/admin/posts");
    } catch (error) {
      console.error("記事削除エラー:", error);
    }
  };

  // ロード中の表示
  if (isLoading) return <div>読み込み中...</div>;

  // エラーまたは記事が見つからない場合
  if (isError || !post)
    return <div className="text-red-500">記事が見つかりません</div>;

  return (
    <PostForm
      initialData={post} // 記事データを渡す
      onSubmit={handleUpdatePost} // 更新処理を渡す
      onDelete={handleDeletePost} // 削除処理を渡す
      buttonText="記事を更新"
    />
  );
}
