import { auth } from "@/lib/auth";

import DashboardView from "@/components/DashboardView";

import { listDocuments } from "@/lib/api";



export default async function DashboardPage() {

  const session = await auth();

  const token = session?.accessToken || "";

  const res = await listDocuments(token).catch(() => ({ data: [] }));

  const documents = res.data || [];



  return <DashboardView initialDocuments={documents} />;

}

