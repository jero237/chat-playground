"use client";
import { Github, PlusIcon, SquareTerminal, Triangle } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SideBar() {
  const pathname = usePathname();
  return (
    <aside className="inset-y fixed  left-0 z-20 flex h-full flex-col border-r">
      <div className="border-b p-2">
        <Button variant="outline" size="icon" aria-label="Home">
          <Triangle className="size-5 fill-foreground" />
        </Button>
      </div>
      <nav className="grid gap-1 p-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={"/"}
              className={cn("rounded-lg", buttonVariants({ variant: "ghost", size: "icon" }), pathname === "/" && "bg-muted")}
              aria-label="Playground"
            >
              <SquareTerminal className="size-5" />
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={5}>
            Playground
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={"/put-product"}
              className={cn("rounded-lg", buttonVariants({ variant: "ghost", size: "icon" }), pathname === "/put-product" && "bg-muted")}
              aria-label="Product"
            >
              <PlusIcon className="size-5" />
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={5}>
            Models
          </TooltipContent>
        </Tooltip>
      </nav>
      <nav className="mt-auto grid gap-1 p-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={"https://github.com/jero237/chat-playground"}
              className={cn(
                "mt-auto rounded-lg",
                buttonVariants({ variant: "ghost", size: "icon" })
              )}
              aria-label="Help"
            >
              <Github className="size-5" />
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={5}>
            Help
          </TooltipContent>
        </Tooltip>
        {/* <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="mt-auto rounded-lg"
              aria-label="Account"
            >
              <SquareUser className="size-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={5}>
            Account
          </TooltipContent>
        </Tooltip> */}
      </nav>
    </aside>
  );
}
