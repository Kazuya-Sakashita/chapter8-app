"use client";

import { Providers } from "../providers";
import AdminSidebar from "./_components/AdminSidebar";
import { useRouteGuard } from "./_hooks/useRouteGuard";
import { usePathname } from "next/navigation";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  useRouteGuard();

  const pathname = usePathname();
  const isSelected = (href: string) => {
    return pathname.includes(href);
  };
  console.log("pathname", pathname);
  return (
    <Providers>
      <div className="flex h-screen">
        {/* サイドバーコンポーネント */}
        <AdminSidebar />

        {/* メインコンテンツ */}
        <main className="flex-1 p-6 bg-white">{children}</main>
      </div>
    </Providers>
  );
};

export default AdminLayout;
