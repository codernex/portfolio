// app/admin/layout.tsx
import AdminSidebar from "@/components/dashboard/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-zinc-950">
      <AdminSidebar />
      <div className="flex-1 overflow-y-auto">
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
