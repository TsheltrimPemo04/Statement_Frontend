export default function Header() {
  return (
    <div className="w-full">
      {/* Top Header Section */}
      <div className="flex items-center justify-between bg-[#496278] text-white px-4 py-2 rounded-t-md">
        <h2 className="font-semibold">
          Case# <span className="font-normal">ACC/CR/2025/7/7</span>
        </h2>

        <div className="flex gap-6 text-sm">
          <p>
            Run Days: <span className="text-[#DE1A1A] font-semibold">9</span>
          </p>
          <p>
            Work Days: <span className="text-[#DE1A1A] font-semibold">0</span>
          </p>
        </div>

        <button className="flex items-center justify-center">
          <img
            src="/dropdown.svg"
            alt="dropdown"
            className="w-4 h-4 opacity-90"
          />
        </button>
      </div>

      {/* Tabs Section */}
      <div className="flex flex-wrap gap-1 text-[14px] text-[#333] px-2 py-1 border-t border-gray-300">
        {[
          "Allegation Details",
          "Investigation Plan",
          "Entities",
          "Interview",
          "iDiary",
          "Case Event",
          "Arrest & Detention",
          "Search & Seizure",
          "Exhibits",
          "Files",
          "Reports",
          "Appraisals",
          "Mail",
          "Chatbot",
        ].map((tab) => (
          <button
            key={tab}
            className={`px-3 py-1 rounded-sm ${
              tab === "Chatbot"
                ? "bg-[#496278] text-white"
                : "bg-white hover:bg-gray-100 border border-gray-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}
