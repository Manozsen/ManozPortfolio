import AdminLayout from "@/components/admin/AdminLayout";

export const metadata = {
  title: "Admin Panel — Manoz's Portfolio",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>;
}
