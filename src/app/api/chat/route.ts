import { searchProduct } from "@/actions/products";
import { ChatMessage } from "@/context/chat";
import { Product } from "@/types/product";
import { WithId } from "mongodb";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const functions = {
  searchProduct: searchProduct,
};

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

async function* makeIterator(messages: ChatCompletionMessageParam[]) {
  messages.unshift({
    role: "system",
    content: `You are a helpful assistant that should recommend products based on the user's search query. You must reference them using the following format: ![name](ObjectId("ID OF THE PRODUCT")). Thanks to that format the product will be retrieved from the db, so respect it. Don't add info that is on the function call but add your personal opinion so the responses are fun.`,
  });
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages,
    tools: [
      {
        type: "function",
        function: {
          name: "searchProduct",
          description: "Search for products on the database",
          parameters: {
            type: "object",
            properties: {
              searchTerm: {
                type: "string",
                description: "The search term to use",
              },
            },
            required: ["searchTerm"],
          },
        },
      },
    ],
    tool_choice: "auto",
  });

  const responseMessage = response.choices[0].message;
  const toolCalls = responseMessage?.tool_calls;

  if (toolCalls) {
    messages.push(responseMessage);
    for (const call of toolCalls) {
      const functionName = call.function?.name;
      if (!functionName || !call.id) continue;
      // @ts-ignore
      const functionToCall = functions[functionName];
      const functionArgs = JSON.parse(call.function?.arguments);
      const functionResponse = await functionToCall(functionArgs.searchTerm);
      messages.push({
        tool_call_id: call.id,
        role: "tool",
        content: JSON.stringify(functionResponse),
      });
    }
  }

  const secondStream = await openai.chat.completions.create({
    model: "gpt-4o",
    messages,
    stream: true,
  });

  console.log(JSON.stringify(messages));

  for await (const chunk of secondStream) {
    if (chunk.choices[0]?.delta?.content) {
      yield new TextEncoder().encode(chunk.choices[0].delta.content);
    }
  }
}

export async function POST(req: Request) {
  const { messages } = (await req.json()) as {
    messages: ChatMessage[];
  };
  const iterator = makeIterator(messages);
  const stream = iteratorToStream(iterator);

  return new Response(stream);
}
