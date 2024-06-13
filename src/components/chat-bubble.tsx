import { BotIcon, UserIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

export default function ChatBubble({
  content,
  type,
}: {
  content: string;
  type: "HUMAN" | "AI";
}) {
  const bubbleVariants = cva("text-sm", {
    variants: {
      type: {
        HUMAN: "rounded-lg bg-blue-100 p-3 dark:bg-blue-900 dark:text-white",
        AI: "pl-3 pr-1",
      },
    },
    defaultVariants: {
      type: "HUMAN",
    },
  });

  return (
    <div
      className={cn(
        "flex justify-end items-start gap-3",
        type === "AI" && "flex-row-reverse"
      )}
    >
      <div className={bubbleVariants({ type })}>
        <p>{content}</p>
      </div>
      <Avatar className="h-8 w-8">
        <AvatarFallback>
          {type === "HUMAN" ? <UserIcon /> : <BotIcon />}
        </AvatarFallback>
      </Avatar>
    </div>
  );
}
