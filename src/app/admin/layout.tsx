"use client";

import { Providers } from "../providers";
import AdminSidebar from "./_components/AdminSidebar";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
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
