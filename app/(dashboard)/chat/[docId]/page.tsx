import { auth } from "@/lib/auth";
import ChatWindow from "@/components/ChatWindow";
import ChatSidebar from "@/components/ChatSidebar";
import { getDocument } from "@/lib/api";

export default async function ChatPage({
  params,
}: {
  params: { docId: string };
}) {
  const { docId } = params;
  const session = await auth();
  const token = session?.accessToken || "";
  const res = await getDocument(token, docId).catch(() => null);
  const doc = res?.data ?? null;

  return (
    <div className="chat-page flex min-h-0 flex-1 flex-col overflow-hidden lg:flex-row">
      <ChatSidebar doc={doc} />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <ChatWindow docId={docId} />
      </div>
    </div>
  );
}
