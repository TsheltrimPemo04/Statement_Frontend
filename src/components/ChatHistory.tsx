import { useState } from "react";

interface ChatHistoryProps {
  onNewChat?: () => void;
}

export default function ChatHistory({ onNewChat }: ChatHistoryProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [menuOpenIndex, setMenuOpenIndex] = useState<number | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [chats, setChats] = useState<string[]>([
    "Most calls between January and March...",
    "Who was the one to initiate the longest call...",
  ]);

  // Add new chat at the top
  const handleNewChat = () => {
    const updatedChats = ["New Chat", ...chats];
    setChats(updatedChats);
    setEditingIndex(0); // edit the newly added chat
    if (onNewChat) onNewChat(); // reset ChatArea
  };

  const handleRenameSave = (index: number, newName: string) => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    const updated = [...chats];
    updated[index] = trimmed;
    setChats(updated);
    setEditingIndex(null);
  };

  const handleMenuClick = (e: React.MouseEvent, i: number) => {
    e.stopPropagation();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setMenuPosition({ top: rect.top + window.scrollY, left: rect.right + 8 });
    setMenuOpenIndex(menuOpenIndex === i ? null : i);
  };

  const handleDelete = (index: number) => {
    setChats(chats.filter((_, i) => i !== index));
    setMenuOpenIndex(null);
  };

  return (
    <div className="w-64 bg-[#F9FAFB] border-r border-gray-300 h-full p-4 flex flex-col">
      <h2 className="text-2xl font-semibold mb-4">
        Intel<span className="text-[#496278]">X</span>
      </h2>

      {/* New Chat Button */}
      <button
        onClick={handleNewChat}
        className="flex items-center justify-center gap-2 bg-white border border-gray-300 text-sm rounded-full py-2 px-3 shadow-sm hover:bg-gray-50 transition"
      >
        <span className="text-lg font-medium">+</span> New Chat
      </button>

      {/* Chat History */}
      <div className="mt-6 flex-1 overflow-y-auto">
        <p className="text-gray-400 text-sm mb-4">Chat History</p>
        <ul className="space-y-4">
          {chats.map((chat, i) => (
            <li
              key={i}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`flex justify-between items-center text-gray-700 text-sm px-2 py-1.5 rounded-md cursor-pointer hover:bg-[#E9E9E9] ${
                menuOpenIndex === i ? "bg-gray-100" : ""
              }`}
            >
              {editingIndex === i ? (
                <input
                  type="text"
                  defaultValue={chat}
                  autoFocus
                  onBlur={(e) => handleRenameSave(i, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter")
                      handleRenameSave(i, (e.target as HTMLInputElement).value);
                  }}
                  className="w-full px-2 py-1 rounded-md border border-gray-300 text-sm outline-none"
                />
              ) : (
                <span className="truncate">{chat}</span>
              )}

              {hoveredIndex === i && editingIndex !== i && (
                <button
                  onClick={(e) => handleMenuClick(e, i)}
                  className="p-1 rounded-full hover:bg-gray-200 cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={4}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6h.01M12 12h.01M12 18h.01"
                    />
                  </svg>
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Dropdown Menu */}
      {menuOpenIndex !== null && menuPosition && (
        <div
          className="absolute bg-white border border-gray-200 shadow-md rounded-md w-28 z-50"
          style={{ top: `${menuPosition.top}px`, left: `${menuPosition.left}px` }}
        >
          <button
            onClick={() => setEditingIndex(menuOpenIndex)}
            className="flex items-center w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
          >
            <img src="/pencil.svg" className="mr-2" /> Rename
          </button>
          <hr className="border-gray-100" />
          <button
            onClick={() => handleDelete(menuOpenIndex)}
            className="flex items-center w-full text-left px-3 py-2 text-sm text-[#DE1A1A] hover:bg-gray-50"
          >
            <img src="/delete.svg" className="mr-2" /> Delete
          </button>
        </div>
      )}
    </div>
  );
}
