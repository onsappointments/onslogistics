import AdminSidebar from "../../components/AdminSidebar";

export default function AdminLayout({ children }) {
  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 p-10 bg-[#F5F5F7] min-h-screen">{children}</main>
    </div>
  );
}
