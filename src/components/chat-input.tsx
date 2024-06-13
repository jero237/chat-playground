"use client";
import { CornerDownLeft, Mic, Paperclip, SendHorizonalIcon, SendIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { ChatContext } from "@/context/chat";
import { useContext, useState } from "react";

export default function ChatInput() {
  const [message, setMessage] = useState("");
  const { sendMessage, isLoading } = useContext(ChatContext);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message) {
      setMessage("");
      sendMessage(message, "user");
    }
  };

  return (
    <form
      className="flex items-center gap-2"
      onSubmit={handleSubmit}
    >
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
      />
      <Button
        type="submit"
        disabled={isLoading}
      >
        <SendHorizonalIcon className="size-4" />
      </Button>
    </form>
  );
}
