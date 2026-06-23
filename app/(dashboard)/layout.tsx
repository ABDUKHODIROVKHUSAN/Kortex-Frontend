import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import ConditionalFooter from "@/components/ConditionalFooter";
import BackendStatusBanner from "@/components/BackendStatusBanner";
import WorkspaceLayoutChrome from "@/components/WorkspaceLayoutChrome";
import { PageBackground } from "@/components/PageBackground";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="relative flex flex-1 flex-col">
      <PageBackground />
      <div className="relative z-10 flex flex-1 flex-col">
        <BackendStatusBanner />
        <div className="mx-auto w-full max-w-6xl shrink-0 px-6 pt-6">
          <SiteHeader />
        </div>
        <WorkspaceLayoutChrome>
          <main className="flex flex-1 flex-col">{children}</main>
        </WorkspaceLayoutChrome>
        <div className="mx-auto w-full max-w-6xl shrink-0 px-6">
          <ConditionalFooter />
        </div>
      </div>
    </div>
  );
}
