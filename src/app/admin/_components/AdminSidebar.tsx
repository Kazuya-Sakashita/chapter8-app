"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const AdminSidebar = () => {
  const pathname = usePathname();
  const [currentPath, setCurrentPath] = useState<string | null>(null);

  useEffect(() => {
    setCurrentPath(pathname);
  }, [pathname]);

  return (
    <aside className="w-64 bg-gray-200 p-4">
      <nav>
        <ul className="space-y-2">
          <li>
            <Link
              href="/admin/posts"
              className={`block p-2 rounded ${
                currentPath?.startsWith("/admin/posts") ? "bg-blue-100" : ""
              }`}
            >
              記事一覧
            </Link>
          </li>
          <li>
            <Link
              href="/admin/categories"
              className={`block p-2 rounded ${
                currentPath?.startsWith("/admin/categories")
                  ? "bg-blue-100"
                  : ""
              }`}
            >
              カテゴリー一覧
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
