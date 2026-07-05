import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/src/lib/admin/auth";

export default async function StatistiquesRedirectPage() {
  if (await isAdminAuthenticated()) {
    redirect("/admin/statistiques");
  }

  redirect("/admin");
}
