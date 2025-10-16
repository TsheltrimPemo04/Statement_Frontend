import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Paperclip, FileText, X } from "lucide-react";

interface ChatMessage {
  sender: "user" | "bot";
  text?: string;
  files?: File[];
}

interface ChatAreaProps {
  resetKey?: number; // triggers a full reset when changed
}

export default function ChatArea({ resetKey }: ChatAreaProps) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Scroll to bottom whenever messages or typing indicator changes
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isBotTyping]);

  // Reset chat when "New Chat" is triggered
  useEffect(() => {
    setMessages([]);
    setMessage("");
    setUploadedFiles([]);
    setIsBotTyping(false);
  }, [resetKey]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() && uploadedFiles.length === 0) return;

    const newMessage: ChatMessage = {
      sender: "user",
      text: message.trim() || undefined,
      files: uploadedFiles.length > 0 ? uploadedFiles : undefined,
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessage("");
    setUploadedFiles([]);

    // Simulate bot typing with delay
    setIsBotTyping(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Here’s a dummy IntelX response for your query.",
        },
      ]);
      setIsBotTyping(false);
    }, 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col h-full bg-[#F9FAFB] relative overflow-hidden">
      {/* --- INITIAL SCREEN --- */}
      {messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <h1 className="text-3xl font-semibold text-gray-800 mb-6">
            Ask Intel<span className="text-[#496278]">X</span>
          </h1>

          {/* Center Input */}
          <motion.form
            layoutId="chatInput"
            transition={{ duration: 0.5, ease: "easeInOut" }}
            onSubmit={handleSend}
            className="bg-white border border-gray-300 rounded-2xl shadow-sm w-[420px] max-w-[80vw] px-4 py-2 flex flex-col"
          >
            {/* Uploaded Files Preview */}
            {uploadedFiles.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {uploadedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-3 py-1.5 bg-[#F8F9FB] border border-gray-200 rounded-lg text-sm text-gray-700 relative"
                  >
                    <FileText className="w-4 h-4 text-[#1E3A8A]" />
                    <div className="flex flex-col leading-tight">
                      <span className="text-xs font-medium truncate w-[100px]">
                        {file.name}
                      </span>
                      <span className="text-[10px] text-gray-500 uppercase">
                        {file.type.split("/")[1] || "FILE"}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="absolute -top-1 -right-1 bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-full w-3.5 h-3.5 flex items-center justify-center"
                    >
                      <X className="w-2 h-2" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 rounded-full hover:bg-gray-100 transition"
              >
                <Paperclip className="w-5 h-5 text-gray-500" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.docx,.txt"
                className="hidden"
                onChange={handleFileUpload}
              />
              <input
                type="text"
                placeholder="Ask anything"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 text-sm bg-transparent focus:outline-none text-gray-800 px-2"
              />
              <button
                type="submit"
                className="p-2 rounded-full hover:bg-gray-100 transition"
              >
                <Send className="w-5 h-5 text-gray-500 hover:text-[#496278]" />
              </button>
            </div>
          </motion.form>
        </div>
      ) : (
        <>
          {/* --- CHAT MESSAGES --- */}
          <div className="flex-1 overflow-y-auto px-8 py-6 space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] rounded-lg px-4 py-2 ${
                    msg.sender === "user"
                      ? "bg-[#E9F2FF] text-gray-800"
                      : "text-gray-800"
                  }`}
                >
                  {msg.text && (
                    <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                  )}
                  {msg.files && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {msg.files.map((file, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 border border-gray-200 rounded-md px-2 py-1 bg-white shadow-sm"
                        >
                          <FileText className="w-4 h-4 text-[#496278]" />
                          <span className="text-xs truncate w-[100px]">
                            {file.name}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            {file.type.split("/")[1]?.toUpperCase()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* --- BOT TYPING INDICATOR --- */}
            {isBotTyping && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                  </div>
                </div>
              </div>
            )}

            <div ref={chatEndRef}></div>
          </div>

          {/* --- INPUT AT BOTTOM --- */}
          <motion.div
            layoutId="chatInput"
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="px-6 py-5 bg-[#F9FAFB]"
          >
            <form
              onSubmit={handleSend}
              className="bg-white border border-gray-300 rounded-2xl shadow-sm w-[420px] max-w-[80vw] mx-auto px-4 py-2 flex flex-col"
            >
              {uploadedFiles.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {uploadedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 px-3 py-1.5 bg-[#F8F9FB] border border-gray-200 rounded-lg text-sm text-gray-700 relative"
                    >
                      <FileText className="w-4 h-4 text-[#1E3A8A]" />
                      <div className="flex flex-col leading-tight">
                        <span className="text-xs font-medium truncate w-[100px]">
                          {file.name}
                        </span>
                        <span className="text-[10px] text-gray-500 uppercase">
                          {file.type.split("/")[1] || "FILE"}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="absolute -top-1 -right-1 bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-full w-3.5 h-3.5 flex items-center justify-center"
                      >
                        <X className="w-2 h-2" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 rounded-full hover:bg-gray-100 transition"
                >
                  <Paperclip className="w-5 h-5 text-gray-500" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.docx,.txt"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <input
                  type="text"
                  placeholder="Ask anything"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1 text-sm bg-transparent focus:outline-none text-gray-800 px-2"
                />
                <button
                  type="submit"
                  className="p-2 rounded-full hover:bg-gray-100 transition"
                >
                  <Send className="w-5 h-5 text-gray-500 hover:text-[#496278]" />
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </div>
  );
}
