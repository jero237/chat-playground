import { ChatMessage } from "@/context/chat";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { BotIcon, UserIcon } from "lucide-react";
import ProductCard from "./product-card";
import { Avatar, AvatarFallback } from "./ui/avatar";

export default function ChatBubble({ content, role }: ChatMessage) {
  const bubbleVariants = cva("text-sm", {
    variants: {
      role: {
        user: "rounded-lg bg-blue-100 p-3 dark:bg-blue-900 dark:text-white",
        assistant: "pl-3 pr-1",
        system: "hidden",
        tool: "hidden",
        function: "hidden",
      },
    },
    defaultVariants: {
      role: "user",
    },
  });

  const regex = /!\[.+\]\(ObjectId\("\w+"\)\)/gi;
  const parts = (content as string).split(regex);
  const matches = (content as string).match(regex);

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
                <ProductCard name={match.name} productId={match.id} />
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
