import OpenAI from "openai";
import { ChatMessage } from "@/context/chat";
import { searchProduct } from "@/actions/products";
import { Product } from "@/types/product";
import { WithId } from "mongodb";

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

async function* makeIterator(
  messages: ChatMessage[],
  searchResults?: WithId<Product>[]
) {
  messages.unshift({
    role: "system",
    content: `You are a helpful assistant that should recommend products based on the user's search query. Your answer should reference products from the following list if they are relevant for the user's query. You must reference them using the following format: ![name](ObjectId("ID OF THE PRODUCT")). Products: ${
      JSON.stringify(searchResults) || "[]"
    }`,
  });
  console.log(messages[0]);
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
  const { messages } = (await req.json()) as { messages: ChatMessage[] };
  const searchResults = await searchProduct(
    messages[messages.length - 1].content
  );
  const iterator = makeIterator(messages, searchResults?.products);
  const stream = iteratorToStream(iterator);

  return new Response(stream);
}
