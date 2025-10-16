import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Paperclip, FileText, X, Bot, User } from "lucide-react";

interface ChatMessage {
  sender: "user" | "bot";
  text?: string;
  files?: File[];
  ts?: number;
}

interface ChatAreaProps {
  resetKey?: number; // triggers a full reset when changed
}

const bubble = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.18 },
};

function formatFileSize(bytes: number) {
  if (!bytes && bytes !== 0) return "";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(k)), sizes.length - 1);
  return `${(bytes / Math.pow(k, i)).toFixed(i ? 1 : 0)} ${sizes[i]}`;
}

export default function ChatArea({ resetKey }: ChatAreaProps) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isBotTyping, setIsBotTyping] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const dropRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Scroll to bottom on updates
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isBotTyping]);

  // Reset chat on new-chat trigger
  useEffect(() => {
    setMessages([]);
    setMessage("");
    setUploadedFiles([]);
    setIsBotTyping(false);
  }, [resetKey]);

  // Auto-grow textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  }, [message, uploadedFiles.length]);

  const sendBotReply = useCallback(() => {
    setIsBotTyping(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Here’s a dummy IntelX response for your query.", ts: Date.now() },
      ]);
      setIsBotTyping(false);
    }, 1200);
  }, []);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if ((!message.trim() && uploadedFiles.length === 0) || isBotTyping) return;

    const newMsg: ChatMessage = {
      sender: "user",
      text: message.trim() || undefined,
      files: uploadedFiles.length ? uploadedFiles : undefined,
      ts: Date.now(),
    };

    setMessages((prev) => [...prev, newMsg]);
    setMessage("");
    setUploadedFiles([]);
    sendBotReply();
  };

  const handleFileUpload = (files: File[]) => {
    if (!files?.length) return;
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  const onInputFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    handleFileUpload(files);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (idx: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  // Drag & drop
  useEffect(() => {
    const zone = dropRef.current;
    if (!zone) return;

    const over = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(true);
    };
    const leave = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
    };
    const drop = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const items = e.dataTransfer?.files ? Array.from(e.dataTransfer.files) : [];
      handleFileUpload(items);
    };

    zone.addEventListener("dragover", over);
    zone.addEventListener("dragleave", leave);
    zone.addEventListener("drop", drop);

    return () => {
      zone.removeEventListener("dragover", over);
      zone.removeEventListener("dragleave", leave);
      zone.removeEventListener("drop", drop);
    };
  }, []);

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Reusable file chip
  const FileChip = ({ file, dense = false }: { file: File; dense?: boolean }) => (
    <div
      className={`flex items-center gap-2 rounded-md border border-slate-200/80 px-2 ${
        dense ? "py-0.5" : "py-1"
      } bg-white/90 text-slate-600 shadow-sm shadow-white/40 backdrop-blur`}
      title={file.name}
    >
      <FileText className="w-4 h-4 text-[#496278]" />
      <span className="text-xs max-w-[140px] truncate">{file.name}</span>
      <span className="text-[10px] text-slate-300">{formatFileSize(file.size)}</span>
    </div>
  );

  return (
    <div
      ref={dropRef}
      className="relative flex h-full flex-col overflow-hidden bg-gradient-to-b from-[#F5F8FE] via-[#F9FBFF] to-white"
    >
      {/* Drag overlay */}
      <AnimatePresence>
        {isDragging && (
          <motion.div
            className="absolute inset-0 z-40 flex items-center justify-center bg-black/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="rounded-2xl border-2 border-dashed border-[#496278] bg-white/80 px-6 py-4 text-[#496278] font-medium">
              Drop files to attach
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="border-b border-slate-200/60 bg-white/60 px-6 py-3 backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Title */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-400">
              IntelX Assistant
            </p>
            <h2 className="text-base font-semibold text-slate-700">
              {messages.length ? "Conversation Thread" : "Start a New Conversation"}
            </h2>
          </div>

          {/* Status badge */}
          <div className="inline-flex items-center gap-3 rounded-full border border-slate-200/70 bg-white px-3 py-1.5 text-[11px] font-medium text-slate-500 shadow-sm">
            <div className="flex items-center gap-1.5">
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Live
            </div>
            <span className="text-slate-300">IntelX v0.3</span>
          </div>
        </div>
      </header>

      {/* Empty state */}
      {messages.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center px-6 pb-12 text-center">
          <motion.h1
            layoutId="chatTitle"
            className="mb-3 text-3xl font-semibold text-slate-700"
          >
            Ask Intel<span className="text-[#496278]">X</span>
          </motion.h1>
          <p className="mb-6 max-w-md text-sm text-slate-500">
            Upload PDFs/DOCs or ask a question to get started.
          </p>

          <motion.form
            layoutId="chatInput"
            transition={{ duration: 0.45, ease: "easeInOut" }}
            onSubmit={handleSend}
            className="w-[560px] max-w-[90vw] rounded-2xl border border-slate-200/80 bg-white/90 px-4 pt-3 pb-2 shadow-lg shadow-slate-300/30 backdrop-blur"
          >
            {/* Upload preview */}
            {uploadedFiles.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {uploadedFiles.map((f, i) => (
                  <div key={i} className="relative">
                    <FileChip file={f} />
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                    className="absolute -top-1 -right-1 bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-full w-4 h-4 flex items-center justify-center"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-end gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100"
              title="Attach files"
            >
              <Paperclip className="h-5 w-5" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
                accept=".pdf,.doc,.docx,.txt"
                className="hidden"
                onChange={onInputFiles}
              />

              <textarea
                ref={textareaRef}
                placeholder="Ask anything…"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={onKeyDown}
                rows={1}
                className="flex-1 resize-none bg-transparent px-2 py-1 text-sm text-slate-700 focus:outline-none"
              />

              <button
                type="submit"
                disabled={(!message.trim() && uploadedFiles.length === 0) || isBotTyping}
                className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-[#496278] disabled:opacity-40"
                title="Send (Enter)"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </motion.form>
        </div>
      ) : (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-8 py-6 space-y-4">
            <AnimatePresence initial={false}>
              {messages.map((msg, i) => {
                const mine = msg.sender === "user";
                return (
                  <motion.div
                    key={i}
                    {...bubble}
                    className={`flex items-start gap-2 ${mine ? "justify-end" : "justify-start"}`}
                  >
                    {!mine && (
                      <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E6EEF7] text-[#496278] shadow-sm shadow-white">
                        <Bot className="h-4 w-4" />
                      </div>
                    )}

                    <div
                      className={`max-w-[68%] rounded-2xl px-4 py-2 shadow-sm shadow-slate-300/20 ${
                        mine
                          ? "rounded-br-sm bg-[#E9F2FF] text-slate-700"
                          : "rounded-bl-sm border border-slate-200/60 bg-white text-slate-700"
                      }`}
                    >
                      {msg.text && <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</p>}

                      {msg.files?.length ? (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {msg.files.map((f, idx) => (
                            <FileChip key={idx} file={f} dense />
                          ))}
                        </div>
                      ) : null}

                      {msg.ts ? (
                        <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-slate-300">
                          {new Date(msg.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      ) : null}
                    </div>

                    {mine && (
                      <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#DBEAFE] text-[#1D4ED8] shadow-sm shadow-white">
                        <User className="h-4 w-4" />
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Bot typing */}
            <AnimatePresence>
              {isBotTyping && (
                <motion.div {...bubble} className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E6EEF7] text-[#496278]">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="rounded-2xl border border-slate-200/60 bg-white px-4 py-2 shadow-sm shadow-slate-200/40">
                    <div className="flex gap-1.5">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400/80 [animation-delay:-0.3s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400/80 [animation-delay:-0.15s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400/80" />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div ref={chatEndRef} />
          </div>

          {/* Composer */}
          <motion.div
            layoutId="chatInput"
            transition={{ duration: 0.45, ease: "easeInOut" }}
            className="bg-gradient-to-t from-white to-[#F5F8FE]/60 px-6 pb-6 pt-4"
          >
            <form
              onSubmit={handleSend}
              className="mx-auto w-[820px] max-w-[92vw] rounded-2xl border border-slate-200/80 bg-white/95 px-4 pt-2 pb-2 shadow-xl shadow-slate-300/40 backdrop-blur"
            >
              {uploadedFiles.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {uploadedFiles.map((f, i) => (
                    <div key={i} className="relative">
                      <FileChip file={f} />
                      <button
                        type="button"
                        onClick={() => removeFile(i)}
                        className="absolute -top-1 -right-1 bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-full w-4 h-4 flex items-center justify-center"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-end gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100"
                  title="Attach files"
                >
                  <Paperclip className="h-5 w-5" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.txt"
                  className="hidden"
                  onChange={onInputFiles}
                />

                <textarea
                  ref={textareaRef}
                  placeholder="Ask anything…  (Shift+Enter = newline)"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={onKeyDown}
                  rows={1}
                  className="flex-1 resize-none bg-transparent px-2 py-1 text-sm text-slate-700 focus:outline-none"
                />

                <button
                  type="submit"
                  disabled={(!message.trim() && uploadedFiles.length === 0) || isBotTyping}
                  className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-[#496278] disabled:opacity-40"
                  title="Send (Enter)"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </div>
  );
}
