import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import AdminDashboardContent from "@/components/AdminDashboardContent";
import AdminPageClient from "@/components/AdminPageClient";
import { PageBackground } from "@/components/PageBackground";

export default async function AdminPage() {
  const session = await auth();
  if (!session) redirect("/login");
  if (!session.user?.isAdmin) redirect("/");

  return (
    <div className="relative flex min-h-screen flex-1 flex-col">
      <PageBackground />
      <div className="relative z-10 flex flex-1 flex-col">
        <SiteHeader />
        <main className="flex-1">
          <AdminPageClient>
            <AdminDashboardContent />
          </AdminPageClient>
        </main>
      </div>
    </div>
  );
}
