"use client";
import { useState } from "react";
import PostCreate from "~/components/PostCreate";
import TabList from "~/components/TabList";
import Feed from "./Feed";
import Friends from "./Friends";

export default function Page() {
  const [activeTab, setActiveTab] = useState<"feed" | "friends">("feed");

  return (
    <div className="grid grid-rows-[auto_1fr] gap-5">
      <TabList activeTab={activeTab} setActiveTab={setActiveTab} />
      <PostCreate />
      {activeTab === "feed" ? <Feed /> : <Friends />}
    </div>
  );
}
