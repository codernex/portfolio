import AdminSidebar from "@/components/dashboard/AdminSidebar";
import { AuthGuard } from "@/auth/guard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard requiredRole="editor">
      <div className="flex min-h-screen bg-zinc-950">
        <AdminSidebar />
        <div className="flex-1 overflow-y-auto">
          <main className="p-8">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
