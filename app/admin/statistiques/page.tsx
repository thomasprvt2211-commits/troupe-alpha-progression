import { redirect } from "next/navigation";
import AdminStatistiquesContent from "@/components/admin/AdminStatistiquesContent";
import { isAdminAuthenticated } from "@/src/lib/admin/auth";

export default async function AdminStatistiquesPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin");
  }

  return <AdminStatistiquesContent />;
}
