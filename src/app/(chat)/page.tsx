import Chat from "@/components/chat";
import Header from "@/components/header";

export default function Home() {
  return (
    <div className="flex flex-col">
      <Header />
      <Chat />
    </div>
  );
}
