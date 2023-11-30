"use client";
import { ClipboardCheck, CornerUpRight } from "lucide-react";
import { useState } from "react";

export default function ShareBtn({ slug }: { slug: string }) {
  const [share, setShare] = useState<boolean>(false);

  const shareHandle = () => {
    setShare(true);
    navigator.clipboard
      .writeText(`${window.location.origin}/r/${slug}`)
      .catch((err) => console.log(err));
    setTimeout(() => {
      setShare(false);
    }, 1000);
  };

  return (
    <button
      onClick={shareHandle}
      className="group flex h-8 items-center gap-1 rounded border border-green-400/20 bg-green-500/10 px-1.5 text-xs text-foreground/90"
    >
      {share ? (
        <ClipboardCheck
          strokeWidth={1.25}
          className="scale-75 transition-transform group-hover:scale-[0.85]"
        />
      ) : (
        <CornerUpRight
          strokeWidth={1.25}
          className="scale-75 transition-transform group-hover:scale-[0.85]"
        />
      )}
    </button>
  );
}
