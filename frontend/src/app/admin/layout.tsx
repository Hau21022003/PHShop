import AdminSidebar from "@/components/admin-sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full">
      {/* Sidebar bên trái */}
      <AdminSidebar />

      {/* Nội dung chính */}
      <main className="flex-1 h-full overflow-y-auto">{children}</main>
    </div>
  );
}
