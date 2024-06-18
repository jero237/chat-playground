"use client";
import { ChatContext } from "@/context/chat";
import {
  SendHorizonalIcon,
  Trash2Icon
} from "lucide-react";
import { useContext, useState } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { useMediaQuery } from "@/hooks/use-media-query";

export default function ChatInput() {
  const [message, setMessage] = useState("");
  const { sendMessage, isLoading, clearMessages } = useContext(ChatContext);

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (message) {
      setMessage("");
      sendMessage(message, "user");
    }
  };

  return (
    <form className="flex items-center gap-2" onSubmit={handleSubmit}>
      <Button variant={"secondary"} onClick={() => clearMessages()}>
        <Trash2Icon className="size-4" />
      </Button>
      <Label htmlFor="message" className="sr-only">
        Message
      </Label>
      <Textarea
        id="message"
        name="message"
        placeholder="Type your message here..."
        // @ts-ignore
        style={{ fieldSizing: "content" }}
        className="h-full min-h-0 resize-none border rounded-lg p-3 shadow-none focus-visible:ring-0"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (isDesktop && e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
          }
        }}
      />
      <Button type="submit" disabled={isLoading}>
        <SendHorizonalIcon className="size-4" />
      </Button>
    </form>
  );
}
