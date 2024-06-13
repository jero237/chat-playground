"use client";
import ChatBubble from "./chat-bubble";
import ChatInput from "./chat-input";

export default function Chat() {
  return (
    <main className="flex-1 w-full max-w-7xl overflow-auto sm:p-4 mx-auto">
    <div className="relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4 lg:col-span-2">
      <div className="flex-1 overflow-auto">
        <div className="flex flex-col gap-4">
          <ChatBubble content="Hi" type="HUMAN" />
          <ChatBubble content="Hi" type="AI" />
        </div>
      </div>
      <ChatInput/>
    </div>
  </main>
  )
}