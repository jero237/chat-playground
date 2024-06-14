import { Share } from "lucide-react";
import { Button, buttonVariants } from "./ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Header({ title }: { title: string }) {
  return (
    <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4">
      <h1 className="text-xl font-semibold">{title}</h1>
      <Link target="_blank" href={"https://youtube.com/watch?v=dQw4w9WgXcQ"} className={cn("ml-auto gap-1.5 text-sm", buttonVariants({ variant: "outline", size: "sm" }))}>
        <Share className="size-3.5" />
        Share
      </Link>
    </header>
  );
}
