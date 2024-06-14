import { BotIcon, UserIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { ChatMessage } from "@/context/chat";
import ProductBadge from "./product-badge";

export default function ChatBubble({ content, role }: ChatMessage) {
  const bubbleVariants = cva("text-sm", {
    variants: {
      role: {
        user: "rounded-lg bg-blue-100 p-3 dark:bg-blue-900 dark:text-white",
        assistant: "pl-3 pr-1",
        system: "hidden",
      },
    },
    defaultVariants: {
      role: "user",
    },
  });

  const regex = /!\[.+\]\(ObjectId\("\w+"\)\)/gi;
  const parts = content.split(regex);
  const matches = content.match(regex);

  return (
    <div
      className={cn(
        "flex justify-end items-start gap-3",
        role === "assistant" && "flex-row-reverse"
      )}
    >
      <div className={bubbleVariants({ role })}>
        <p className="whitespace-pre-line">
          {parts.map((part, index) => {
            let match = {
              name: "",
              id: "",
            };
            if (matches && matches[index - 1]) {
              const nameRegex = /(?<=!\[)(.*)(?=\])/;
              const idRegex = /(?<=ObjectId\(")(.*)(?="\))/;
              match.name = nameRegex.exec(matches[index - 1])?.[0] || "";
              match.id = idRegex.exec(matches[index - 1])?.[0] || "";
            }
            return (
              <>
                <ProductBadge name={match.name} productId={match.id} />
                {part}
              </>
            );
          })}
        </p>
      </div>
      <Avatar className="h-8 w-8">
        <AvatarFallback>
          {role === "user" ? <UserIcon /> : <BotIcon />}
        </AvatarFallback>
      </Avatar>
    </div>
  );
}
