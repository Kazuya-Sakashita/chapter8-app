"use client";

import { memo } from "react";
import Link from "next/link";

type CategoryType = {
  id: number;
  name: string;
};

type Props = {
  category: CategoryType;
};

const CategoryCard: React.FC<Props> = ({ category }) => {
  console.log(`🔄 Rendering CategoryCard: ${category.id}`);

  return (
    <div className="bg-white p-4 border-b-2 mt-2">
      <h2 className="text-2xl truncate text-left">
        <Link
          href={`/admin/categories/${category.id}`}
          className="text-gray-700"
        >
          {category.name}
        </Link>
      </h2>
    </div>
  );
};

/**
 * `React.memo` を適用し、同じ `category.id` の場合は再レンダリングしない
 */
const propsAreEqual = (prevProps: Props, nextProps: Props) => {
  return prevProps.category.id === nextProps.category.id;
};

export default memo(CategoryCard, propsAreEqual);
