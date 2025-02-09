"use client";

import { memo, useMemo } from "react";
import { MicroCmsPost } from "@/app/_types/MicroCmsPost";

type Props = {
  post: MicroCmsPost;
  isDetail?: boolean;
};

const PostCard: React.FC<Props> = ({ post, isDetail = false }) => {
  console.log("Rendering PostCard", post.id);

  // `useMemo` で日付のフォーマットをキャッシュ
  const formattedDate = useMemo(() => {
    console.log("Formatting date for:", post.createdAt);

    if (!post.createdAt) return "日付不明";

    const date = new Date(post.createdAt);
    if (isNaN(date.getTime())) return "日付不明";

    return new Intl.DateTimeFormat("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);
  }, [post.createdAt]);

  // console.log("postデータ:", post);

  return (
    <div className={`bg-white ${isDetail ? "" : " p-4 border mt-8"}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p className="text-xs text-gray-500">{formattedDate}</p>
        <div className="flex flex-wrap gap-2">
          {post.categories?.map((category, index) => (
            <span
              key={index}
              className="text-sm text-blue-700 px-2 py-1 rounded border border-blue-700"
            >
              {category.name}
            </span>
          ))}
        </div>
      </div>

      <h2 className="text-2xl mt-4 mb-2 truncate text-left">{post.title}</h2>
      <p className={`text-gray-600 mt-2 ${isDetail ? "" : "line-clamp-2"}`}>
        {post.content}
      </p>
    </div>
  );
};

/**
 * `propsAreEqual` は、React.memo のカスタム比較関数。
 * 前回の `props` と新しい `props` を比較し、
 * 再レンダリングが不要な場合は、コンポーネントのレンダリングをスキップする。
 *
 * - `prevProps.post.id === nextProps.post.id`: 投稿 ID が同じなら変更なしと判断
 * - `prevProps.isDetail === nextProps.isDetail`: 詳細表示フラグが変わらなければ変更なしと判断
 *
 * これにより、不要な再レンダリングを防止する
 */
const propsAreEqual = (prevProps: Props, nextProps: Props) => {
  return (
    prevProps.post.id === nextProps.post.id &&
    prevProps.isDetail === nextProps.isDetail
  );
};

// `React.memo` を適用して不要な再レンダリングを防ぐ
export default memo(PostCard, propsAreEqual);
