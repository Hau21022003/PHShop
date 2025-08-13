import AdminSidebar from "@/components/admin-sidebar";
import UserHeader from "@/components/header";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full flex flex-col">
      <UserHeader />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
