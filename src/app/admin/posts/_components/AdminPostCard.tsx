"use client";

import Link from "next/link";
import { Post } from "@/app/_types/post";

type Props = {
  post: Post;
};

export default function AdminPostCard({ post }: Props) {
  return (
    <Link href={`/admin/posts/${post.id}`} passHref>
      <div className="border-b-2 pb-4 cursor-pointer hover:bg-gray-100 p-2">
        <h2 className="text-2xl mt-4 mb-2 truncate">{post.title}</h2>
        <p className="text-sm text-gray-500">
          {post.createdAt
            ? new Date(post.createdAt).toLocaleDateString()
            : "日付不明"}
        </p>
      </div>
    </Link>
  );
}
