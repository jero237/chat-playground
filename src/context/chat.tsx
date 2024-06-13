"use client";
import { createContext, useState } from "react";

export interface ChatMessage {
  content: string;
  role: "assistant" | "user";
}

interface ChatContextType {
  messages: ChatMessage[];
  sendMessage: (content: string, type: ChatMessage["role"]) => void;
  isLoading: boolean;
}

export const ChatContext: React.Context<ChatContextType> =
  createContext<ChatContextType>({
    messages: [],
    sendMessage: () => {},
    isLoading: false,
  });

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (content: string, role: ChatMessage["role"]) => {
    setIsLoading(true);
    setMessages([
      ...messages,
      { content, role },
      { content: "", role: "assistant" },
    ]);
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages: [...messages, { content, role }] }),
    });

    if (res.body) {
      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let done = false;

      let message = "";
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;

        const chunk = decoder.decode(value);
        message += chunk;
        setMessages((prevState) => {
          return [
            ...prevState.slice(0, prevState.length - 1),
            { content: message, role: "assistant" },
          ];
        });
      }
    }
    setIsLoading(false);
  };

  return (
    <ChatContext.Provider value={{ messages, sendMessage, isLoading }}>
      {children}
    </ChatContext.Provider>
  );
};
