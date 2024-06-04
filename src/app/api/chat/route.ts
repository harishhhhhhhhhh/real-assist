import { StreamingTextResponse, Message } from "ai";
import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { BytesOutputParser } from "@langchain/core/output_parsers";
import { RetrievalQAChain } from "langchain/chains";



import { indexDocuments } from '../../../scripts/indexDocuments';

import { OLLAMA_URL } from "@/lib/constants";

function fetchLastUserMessage(messages: any) {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === 'user') {
      return messages[i].content;
    }
  }
  return "Hi";
}



export async function POST(req: Request) {
  const { messages, selectedModel } = await req.json();

  const vectorStore = await indexDocuments();
  console.log("vector storeeee", vectorStore);
  console.log("from message", messages);
  const lastHumanMessageContent = fetchLastUserMessage(messages)
  const relevantVectors = await vectorStore.similaritySearch(lastHumanMessageContent, 3);


  const model = new ChatOllama({
    baseUrl: OLLAMA_URL,
    model: selectedModel,
  });

  const parser = new BytesOutputParser();

  const chain = RetrievalQAChain.fromLLM(
    model,
    vectorStore.asRetriever(),
    {}
  )

  // const stream = await model
  //   .pipe(parser)
  //   .stream(relevantVectors.map((vector) => new AIMessage(vector.pageContent)));

  const stream = await chain.stream({
    chat_history: messages,
    lastHumanMessageContent,
  })

  return new StreamingTextResponse(stream);
}


