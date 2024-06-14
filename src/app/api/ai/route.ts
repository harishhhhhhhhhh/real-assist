import { PromptTemplate } from '@langchain/core/prompts';
import { HttpResponseOutputParser } from 'langchain/output_parsers';
import { RunnableSequence } from '@langchain/core/runnables'
import { formatDocumentsAsString } from 'langchain/util/document';

import { StreamingTextResponse, Message, createStreamDataTransformer, AIStream } from "ai";
import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { Document } from "@langchain/core/documents";

import { OLLAMA_MODEL, OLLAMA_URL } from "@/lib/constants";
import processDocsStore from '@/lib/processDocs';


export const dynamic = "force-dynamic";

const TEMPLATE = `You are a  RealPage Hr assistant. Your primary task is to answer questions based STRICTLY on the provided context.
 
RULES:
- ONLY answer if the question relates directly to the provided context.
- Do NOT provide information that is not explicitly mentioned in the context. Avoid speculating or adding details from outside the context.
- If the question does NOT directly match with the context, respond with {dont_know_message}.
- If no context is provided, always respond with {dont_know_message}.
- Dont express something like according to context etc, just try to answer user questions in a human way according to the context.
- If the question is a greeting (like "Hello", "Hi", etc.), respond with a corresponding greeting.
 
Remember: Stick to the context. If uncertain, respond with {dont_know_message}. And also try to use points to display answer whenever necessary.

chat_history: {chat_history} 

context: {context}
 
question: {question}`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);

    const currentMessage = messages[messages.length - 1];

    if (currentMessage.content.startsWith('@')) {
      const response = new Response(null, { status: 204 })
      const stream = AIStream(response);
      return new StreamingTextResponse(stream);
    }

    const { vectorStore, allChunks } = await processDocsStore();
    const relevantVectors = await vectorStore.similaritySearch(currentMessage.content, 1);
    /* const contextText = relevantVectors.map((doc: any) => doc.page_content).join("\n\n---\n\n");
    console.log("relevant vectorssss", relevantVectors);
    console.log("curent message", currentMessage.content)
    // console.log("things going to llm as context", formatDocumentsAsString(relevantVectors))
    const allChunks = getProcessedChunks();
    // console.log("all chunks", allChunks) */
    const chunkIds = relevantVectors.map((vector: any) => vector.metadata.id)
    const combinedVectors = createCombinedChunks(chunkIds, allChunks, 2)
    console.log("previos current will all vecotrs", combinedVectors);

    const chain = RunnableSequence.from([
      {
        question: (input) => input.question,
        chat_history: (input) => input.chat_history,
        dont_know_message: () => getDontKnowMessage(),
        context: () => formatDocumentsAsString(combinedVectors),
      },
      PromptTemplate.fromTemplate(TEMPLATE),
      new ChatOllama({
        baseUrl: OLLAMA_URL,
        model: OLLAMA_MODEL,
        temperature: 0,
      }),
      new HttpResponseOutputParser(),
    ]);

    // Convert the response into a friendly text-stream
    const stream = await chain.stream({
      chat_history: formattedPreviousMessages.join('\n'),
      question: currentMessage.content,
    });

    // Respond with the stream
    return new StreamingTextResponse(
      stream.pipeThrough(createStreamDataTransformer())
    );
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: e.status ?? 500 });
  }
}

/**
 * Basic memory formatter that stringifies and passes
 * message history directly into the model.
 */
const formatMessage = (message: Message) => {
  return `${message.role}: ${message.content}`;
};

const getDontKnowMessage = () => {
  return (`
  I am not aware of the answer to the question.
  Please contact the HR team for assistance.
  Email: hr@realpage.com
`)
}

const createCombinedChunks = (chunkIds: any, allChunks: any, length: number) => {
  return chunkIds.map((chunkId: any) => {
    const currentChunkIndex = allChunks.findIndex((chunk: any) => chunk.metadata.id === chunkId);

    let chunksListContent = [];
    for (let i = (currentChunkIndex - length); i <= (currentChunkIndex + length); i++) {
      if (allChunks[i]) {
        chunksListContent.push(allChunks[i].pageContent);
      }
    }

    /* const ansistorChunk = allChunks[currentChunkIndex - 1] || null;
    const previousChunk = allChunks[currentChunkIndex - 1] || null; */
    const currentChunk = allChunks[currentChunkIndex];
    /* const nextChunk = allChunks[currentChunkIndex + 1] || null; */

    const combinedPageContent = chunksListContent.join('\n\n---\n\n');
    return new Document({
      pageContent: combinedPageContent,
      metadata: { ...currentChunk.metadata }
    });
  });
}