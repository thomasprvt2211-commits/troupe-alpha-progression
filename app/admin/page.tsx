import { redirect } from "next/navigation";
import AdminLoginForm from "@/components/admin/AdminLoginForm";
import { isAdminAuthenticated } from "@/src/lib/admin/auth";

export default async function AdminPage() {
  if (await isAdminAuthenticated()) {
    redirect("/admin/statistiques");
  }

  return (
    <div className="section-container flex min-h-[60vh] items-center py-16 sm:py-20">
      <AdminLoginForm />
    </div>
  );
}
