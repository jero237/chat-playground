"use client";
import {
  ChatCompletionAssistantMessageParam,
  ChatCompletionUserMessageParam,
} from "openai/resources/index.mjs";
import { createContext, useEffect, useState } from "react";

export type ChatMessage =
  | ChatCompletionAssistantMessageParam
  | ChatCompletionUserMessageParam;

export interface ChatContextType {
  messages: ChatMessage[];
  sendMessage: (content: string, type: ChatMessage["role"]) => void;
  isLoading: boolean;
  clearMessages: () => void;
}

export const ChatContext: React.Context<ChatContextType> =
  createContext<ChatContextType>({
    messages: [],
    sendMessage: () => {},
    isLoading: false,
    clearMessages: () => {},
  });

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedMessages = localStorage.getItem("chatMessages");
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
  }, []);

  useEffect(() => {
    if (messages.length) localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  const clearMessages = () => {
    setMessages([]);
    localStorage.removeItem("chatMessages");
  }

  const sendMessage = async (content: string) => {
    setIsLoading(true);
    setMessages([
      ...messages,
      { role: "user", content },
      { content: "", role: "assistant" },
    ]);
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [...messages, { content, role: "user" }],
      }),
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
    <ChatContext.Provider value={{ messages, sendMessage, isLoading, clearMessages }}>
      {children}
    </ChatContext.Provider>
  );
};
