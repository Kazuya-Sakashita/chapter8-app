"use client";

import { memo, useMemo } from "react";
import { useRouter } from "next/navigation"; // 追加
import { Post } from "@/app/_types/post";
import { formatDate } from "@/app/lib/utils/dateUtils"; // 日付フォーマット関数をインポート

type Props = {
  post: Post;
  isDetail?: boolean;
};

const AdminPostCard: React.FC<Props> = ({ post }) => {
  const router = useRouter(); // useRouter フックを追加
  console.log("Rendering PostCard", post.id);
  console.log("カテゴリデータ:", post.categories);

  // 日付フォーマットを共通化した関数で処理
  const formattedDate = useMemo(() => {
    return formatDate(post.createdAt); // formatDateを使用して日付をフォーマット
  }, [post.createdAt]);

  console.log("postデータ:", post);

  // ポスト全体をクリックしたときに詳細ページへ遷移
  const handlePostClick = () => {
    router.push(`/admin/posts/${post.id}`); // 詳細ページに遷移
  };

  return (
    <div className="border-b-2 pb-4 cursor-pointer" onClick={handlePostClick}>
      {" "}
      {/* ここでクリックイベントを設定 */}
      <h2 className="text-2xl mt-4 mb-2 truncate text-left">{post.title}</h2>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p className="text-xs text-gray-500">{formattedDate}</p>
      </div>
    </div>
  );
};

const propsAreEqual = (prevProps: Props, nextProps: Props) => {
  return (
    prevProps.post.id === nextProps.post.id &&
    prevProps.isDetail === nextProps.isDetail
  );
};

// `React.memo` を適用して不要な再レンダリングを防ぐ
export default memo(AdminPostCard, propsAreEqual);
