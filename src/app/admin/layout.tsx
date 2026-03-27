import AdminGuard from "@/components/AdminGuard";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <div className="flex bg-[#0A0A0B] min-h-[100dvh]">
        <AdminSidebar />
        <div className="flex-1 w-full relative md:ml-[280px]">
          {children}
        </div>
      </div>
    </AdminGuard>
  );
}
