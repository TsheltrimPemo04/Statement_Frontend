import { useRef, useState } from "react";

interface ChatHistoryProps {
  onNewChat?: () => void;
}

export default function ChatHistory({ onNewChat }: ChatHistoryProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [menuOpenIndex, setMenuOpenIndex] = useState<number | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(0);
  const [chats, setChats] = useState<string[]>([
    "Most calls between January and March...",
    "Who was the one to initiate the longest call...",
  ]);

  const handleNewChat = () => {
    const updated = ["New Chat", ...chats];
    setChats(updated);
    setEditingIndex(0);
    setSelectedIndex(0);
    onNewChat?.();
  };

  const handleRenameSave = (index: number, newName: string) => {
    const trimmed = newName.trim();
    if (!trimmed) return setEditingIndex(null);
    const list = [...chats];
    list[index] = trimmed;
    setChats(list);
    setEditingIndex(null);
  };

  const handleMenuClick = (e: React.MouseEvent, i: number) => {
    e.stopPropagation();
    const triggerRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect();
    const top = triggerRect.top - (containerRect?.top ?? 0) + (containerRef.current?.scrollTop ?? 0);
    const left = triggerRect.left - (containerRect?.left ?? 0) + triggerRect.width + 8 + (containerRef.current?.scrollLeft ?? 0);

    setMenuPosition({ top, left });
    setMenuOpenIndex(menuOpenIndex === i ? null : i);
  };

  const handleDelete = (index: number) => {
    const next = chats.filter((_, i) => i !== index);
    setChats(next);
    setMenuOpenIndex(null);
    if (selectedIndex === index) setSelectedIndex(null);
  };

return (
  <aside
    ref={containerRef}
    className="h-full min-h-0 p-3 flex flex-col relative bg-transparent bg-white border-r border-gray-200" >
      {/* Brand */}
      <div className="mb-3">
        <h2 className="text-xl font-semibold tracking-tight">
          Intel<span className="text-[#496278]">X</span>
        </h2>
        <p className="text-xs text-gray-500">Statement Intelligence</p>
      </div>

      {/* Actions */}
      <div className="sticky top-0 z-10 bg-gradient-to-b from-white to-white/70 py-2">
        <button
          onClick={handleNewChat}
          className="w-full inline-flex items-center justify-center gap-2 bg-[#0F172A] text-white text-sm rounded-lg py-2.5 px-3 shadow-sm hover:opacity-95 active:opacity-90 transition"
        >
          <span className="text-base leading-none">＋</span>
          New Chat
        </button>
      </div>

      {/* Search (optional visual polish) */}
      <div className="mt-3">
        <div className="relative">
          <input
            placeholder="Search chats…"
            className="w-full text-sm rounded-md border border-gray-200 bg-white px-8 py-2 outline-none focus:ring-2 focus:ring-[#496278]/20 focus:border-[#496278]"
            onChange={() => {}}
          />
          <svg
            className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-3.5-3.5" />
          </svg>
        </div>
      </div>

      {/* List */}
      <div className="mt-4 flex-1 overflow-y-auto pr-1">
        <div className="text-[11px] uppercase tracking-wide text-gray-400 mb-2">Chat History</div>

        <ul className="space-y-1.5">
          {chats.map((chat, i) => {
            const isSelected = selectedIndex === i;
            const isEditing = editingIndex === i;

            return (
              <li
                key={i}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => setSelectedIndex(i)}
                className={[
                  "group flex items-center gap-2 rounded-md px-2.5 py-2 cursor-pointer transition",
                  isSelected ? "bg-[#F1F5F9] ring-1 ring-gray-200" : "hover:bg-gray-50",
                  menuOpenIndex === i ? "bg-gray-50" : "",
                ].join(" ")}
              >
                {/* Leading icon */}
                <div className="shrink-0 inline-flex items-center justify-center h-6 w-6 rounded-md bg-[#E2E8F0] text-[#475569]">
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
                    <path d="M4 5a2 2 0 0 1 2-2h6l2 2h4a2 2 0 0 1 2 2v3H4V5z" />
                    <path d="M4 10h16v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7z" />
                  </svg>
                </div>

                {/* Title */}
                <div className="min-w-0 flex-1">
                  {isEditing ? (
                    <input
                      type="text"
                      defaultValue={chat}
                      autoFocus
                      onBlur={(e) => handleRenameSave(i, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleRenameSave(i, (e.target as HTMLInputElement).value);
                        if (e.key === "Escape") setEditingIndex(null);
                      }}
                      className="w-full px-2 py-1 rounded-md border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-[#496278]/20"
                    />
                  ) : (
                    <>
                      <div className="text-[13px] text-gray-800 truncate">{chat}</div>
                      <div className="text-[11px] text-gray-400">Updated just now</div>
                    </>
                  )}
                </div>

                {/* Kebab */}
                {hoveredIndex === i && !isEditing && (
                  <button
                    onClick={(e) => handleMenuClick(e, i)}
                    className="p-1 rounded-md hover:bg-gray-200/60"
                    aria-label="More"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-gray-600"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.4}
                    >
                      <path strokeLinecap="round" d="M12 6h.01M12 12h.01M12 18h.01" />
                    </svg>
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Footer */}
      <div className="pt-3 mt-2 border-t border-gray-100 text-[11px] text-gray-400">
        <span>v0.3 • Auto-saves titles</span>
      </div>

      {/* Dropdown Menu */}
      {menuOpenIndex !== null && menuPosition && (
        <div
            className="absolute bg-white border border-gray-200 shadow-lg rounded-md w-36 z-50"
            style={{ top: menuPosition.top, left: menuPosition.left }}
          >
          <button
            onClick={() => setEditingIndex(menuOpenIndex)}
            className="flex items-center w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
          >
            <img src="/pencil.svg" className="mr-2 h-4 w-4" alt="" /> Rename
          </button>
          <button
            onClick={() => handleDelete(menuOpenIndex)}
            className="flex items-center w-full text-left px-3 py-2 text-sm text-[#DE1A1A] hover:bg-gray-50"
          >
            <img src="/delete.svg" className="mr-2 h-4 w-4" alt="" /> Delete
          </button>
        </div>
      )}
    </aside>
  );
}
