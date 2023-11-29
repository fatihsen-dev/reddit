"use client";
import { useState } from "react";
import TabList from "~/components/TabList";
import Feed from "./Feed";
import Following from "./Following";

export default function Page() {
  const [activeTab, setActiveTab] = useState<"feed" | "following">("feed");

  return (
    <div className="grid grid-rows-[auto_1fr] gap-5">
      <TabList activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === "feed" ? <Feed /> : <Following />}
    </div>
  );
}
