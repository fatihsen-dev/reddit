"use client";

interface IProps {
  activeTab: "feed" | "friends";
  setActiveTab: (val: "feed" | "friends") => void;
}

export default function TabList({ activeTab, setActiveTab }: IProps) {
  return (
    <div className="grid grid-cols-2 gap-5">
      <button
        onClick={() => setActiveTab("feed")}
        className={`flex items-center justify-center rounded-md border border-neutral-400/10 p-2.5 py-1.5 font-light transition-colors ${
          activeTab === "feed"
            ? "bg-blue-400/10 dark:bg-neutral-400/10"
            : "bg-neutral-400/[.025]"
        }`}
      >
        Feed
      </button>
      <button
        onClick={() => setActiveTab("friends")}
        className={`flex items-center justify-center rounded-md border border-neutral-400/10 p-2.5 py-1.5 font-light transition-colors ${
          activeTab === "friends"
            ? "bg-blue-400/10 dark:bg-neutral-400/10"
            : "bg-neutral-400/[.025]"
        }`}
      >
        Friends
      </button>
    </div>
  );
}
