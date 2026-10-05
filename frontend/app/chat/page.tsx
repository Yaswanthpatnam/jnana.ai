"use client";

import React from "react";
import { useRouter } from "next/navigation";
import JnanaChat from "@/components/chat/JnanaChat";

export default function ChatPage() {
  const router = useRouter();

  return (
    <main className="w-full h-screen overflow-hidden bg-white">
      <JnanaChat
        isOverlay={false}
        onClose={() => router.push("/")}
      />
    </main>
  );
}

