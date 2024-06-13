import OpenAI from "openai";
import { ChatMessage } from "@/context/chat";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function iteratorToStream(iterator: any) {
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next();

      if (done) {
        controller.close();
      } else {
        controller.enqueue(value);
      }
    },
  });
}

async function* makeIterator(messages: ChatMessage[]) {
  const stream = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    stream: true,
    messages,
  });

  for await (const chunk of stream) {
    if (chunk.choices[0]?.delta?.content) {
      yield new TextEncoder().encode(chunk.choices[0].delta.content);
    }
  }
}

export async function POST(req: Request) {
  const { messages } = await req.json();
  const iterator = makeIterator(messages);
  const stream = iteratorToStream(iterator);

  return new Response(stream);
}
