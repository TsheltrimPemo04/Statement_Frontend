// pages/chatbot.tsx (or app/chatbot/page.tsx)
import { useState } from "react";
import FolderSidebar from "../components/FolderSidebar";
import ChatHistory from "../components/ChatHistory";
import ChatArea from "../components/ChatArea";

export default function Chatbot() {
  // If you have a fixed top bar, set its pixel height here.
  const HEADER_H = 56;

  const [resetKey, setResetKey] = useState(0);
  const handleNewChat = () => setResetKey((p) => p + 1);

  return (
    <div
      className="w-full bg-[#F6F7F9]"
      style={{ height: `calc(100dvh - ${HEADER_H}px)` }}
    >
      <div className="grid h-full grid-cols-[320px_300px_1fr] gap-0 overflow-hidden">
        {/* Left: Folder tree */}
        <aside className="min-h-0 bg-white border-r border-gray-200 overflow-hidden">
          <div className="h-full min-h-0 overflow-y-auto">
            <FolderSidebar />
          </div>
        </aside>

        {/* Middle: Chat history (menu needs to overflow & sit above chat area) */}
        <aside className="relative z-20 min-h-0 border-r border-gray-200 bg-white overflow-visible">
          <div className="h-full min-h-0">
            <ChatHistory onNewChat={handleNewChat} />
          </div>
        </aside>

        {/* Right: Chat area */}
        <main className="relative z-10 min-w-0 min-h-0 overflow-hidden bg-[#F9FAFB]">
          <div className="h-full min-h-0">
            <ChatArea resetKey={resetKey} />
          </div>
        </main>
      </div>
    </div>
  );
}
