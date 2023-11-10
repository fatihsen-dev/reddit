"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "~/store/auth";
import ListItem from "./ListItem";

export default function PageList() {
  const { user } = useAuthStore();

  const [pages, setPages] = useState([
    { label: "Feed", href: "/" },
    { label: "Profile", href: `/u/${user?.username}` },
  ]);

  useEffect(() => {
    setPages([
      { label: "Feed", href: "/" },
      { label: "Profile", href: `/u/${user?.username}` },
    ]);
  }, [user]);

  return (
    <div className="grid content-start gap-2">
      <h3 className="text-sm text-neutral-400">Pages</h3>
      <ul className="grid content-start gap-2">
        {pages.map((el, index) => (
          <ListItem key={index} label={el.label} href={el.href} />
        ))}
      </ul>
    </div>
  );
}
