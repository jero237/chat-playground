"use client";
import { ChatContext, ChatProvider } from "@/context/chat";
import ChatBubble from "./chat-bubble";
import ChatInput from "./chat-input";
import { useContext } from "react";

export default function Chat() {
  const { messages } = useContext(ChatContext);
  return (
    <main className="flex-1 w-full max-w-7xl overflow-auto sm:p-4 mx-auto">
      <div className="relative flex h-full min-h-[50vh] flex-col sm:rounded-xl bg-muted/50 p-4 lg:col-span-2">
        <div className="flex-1 overflow-y-auto pb-2">
          <div className="flex flex-col gap-4">
            {messages.map((message, index) => (
              <ChatBubble
                key={index}
                content={message.content}
                role={message.role}
              />
            ))}
          </div>
        </div>
        <ChatInput />
      </div>
    </main>
  );
}
