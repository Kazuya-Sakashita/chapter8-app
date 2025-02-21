"use client";

import { memo, useMemo } from "react";
import { Post } from "@/app/_types/post";
import { formatDate } from "@/app/lib/utils/dateUtils";

type Props = {
  post: Post;
  isDetail?: boolean;
};

const PostCard: React.FC<Props> = ({ post, isDetail = false }) => {
  console.log("Rendering PostCard", post.id);
  console.log("カテゴリデータ:", post.categories);

  // `useMemo` で日付のフォーマットをキャッシュ
  // 共通化した日付フォーマット関数を使用
  const formattedDate = useMemo(() => {
    return formatDate(post.createdAt);
  }, [post.createdAt]);

  console.log("postデータ:", post);

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
              {category.name} {/* `category.name` を直接取得 */}
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
