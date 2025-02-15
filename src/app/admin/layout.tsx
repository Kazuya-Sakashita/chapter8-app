"use client";

import AdminSidebar from "./_components/AdminSidebar";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen">
      {/* サイドバーコンポーネント */}
      <AdminSidebar />

      {/* メインコンテンツ */}
      <main className="flex-1 p-6 bg-white">{children}</main>
    </div>
  );
};

export default AdminLayout;
