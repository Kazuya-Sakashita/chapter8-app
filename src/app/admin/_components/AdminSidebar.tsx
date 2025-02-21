"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import AdminMenu from "./AdminMenu";

const AdminSidebar = () => {
  const pathname = usePathname();
  const [currentPath, setCurrentPath] = useState<string | null>(null);

  useEffect(() => {
    setCurrentPath(pathname);
  }, [pathname]);

  const menuItems = [
    { href: "/admin/posts", label: "記事一覧" },
    { href: "/admin/categories", label: "カテゴリー一覧" },
  ];

  return (
    <aside className="w-64 bg-gray-200 p-4">
      <nav>
        <AdminMenu items={menuItems} currentPath={currentPath} />
      </nav>
    </aside>
  );
};

export default AdminSidebar;
