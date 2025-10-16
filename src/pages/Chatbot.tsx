import { useState } from "react";
import FolderSidebar from "../components/FolderSidebar";
import ChatHistory from "../components/ChatHistory";
import ChatArea from "../components/ChatArea";

export default function Chatbot() {
  const [resetKey, setResetKey] = useState(0);

  // Triggered when user clicks "New Chat" in ChatHistory
  const handleNewChat = () => {
    setResetKey((prev) => prev + 1);
  };

  return (
    <div className="flex w-full h-screen bg-[#F9FAFB] overflow-hidden">
      {/* Left Folder Sidebar */}
      <div className="w-[25%] border-r border-gray-200 bg-white overflow-y-auto">
        <FolderSidebar />
      </div>

      {/* Middle Chat History */}
      <div className="w-[20%] border-gray-200 bg-[#F9FAFB]">
        <ChatHistory onNewChat={handleNewChat} />
      </div>

      {/* Right Chat Area */}
      <div className="flex-1">
        <ChatArea resetKey={resetKey} />
      </div>
    </div>
  );
}
