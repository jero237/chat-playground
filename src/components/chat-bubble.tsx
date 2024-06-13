import { BotIcon, UserIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { ChatMessage } from "@/context/chat";

export default function ChatBubble({
  content,
  role,
}: ChatMessage) {
  const bubbleVariants = cva("text-sm", {
    variants: {
      role: {
        user: "rounded-lg bg-blue-100 p-3 dark:bg-blue-900 dark:text-white",
        assistant: "pl-3 pr-1",
      },
    },
    defaultVariants: {
      role: "user",
    },
  });

  return (
    <div
      className={cn(
        "flex justify-end items-start gap-3",
        role === "assistant" && "flex-row-reverse"
      )}
    >
      <div className={bubbleVariants({ role })}>
        <p className="whitespace-pre-line">{content || "..."}</p>
      </div>
      <Avatar className="h-8 w-8">
        <AvatarFallback>
          {role === "user" ? <UserIcon /> : <BotIcon />}
        </AvatarFallback>
      </Avatar>
    </div>
  );
}
