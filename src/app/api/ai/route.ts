import { PromptTemplate } from '@langchain/core/prompts';
import { HttpResponseOutputParser } from 'langchain/output_parsers';
import { RunnableSequence } from '@langchain/core/runnables'
import { formatDocumentsAsString } from 'langchain/util/document';
 
import { StreamingTextResponse, Message, createStreamDataTransformer } from "ai";
import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { BytesOutputParser } from "@langchain/core/output_parsers";
import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";
import { Document } from "@langchain/core/documents";
 
import { OLLAMA_MODEL, OLLAMA_URL } from "@/lib/constants";
import { getProcessedChunks } from '@/lib/processDocs';
import processDocsStore from '@/lib/processDocs';
 
 
export const dynamic = "force-dynamic";
 
/**
 * Basic memory formatter that stringifies and passes
 * message history directly into the model.
 */
const formatMessage = (message: Message) => {
  return `${message.role}: ${message.content}`;
};
 
const TEMPLATE = `You are a  RealPage Hr assistant. Your primary task is to answer questions based STRICTLY on the provided context.
 
RULES:
- ONLY answer if the question relates directly to the provided context.
- Do NOT provide information that is not explicitly mentioned in the context. Avoid speculating or adding details from outside the context.
- If the question does NOT directly match with the context, respond with  I don't know.
- If no context is provided, always respond with I don't know.
-Dont express something like according to context etc, just try to answer user questions in a human way according to the context
- If the question is a greeting (like "Hello", "Hi", etc.), respond with a corresponding greeting.
 
Remember: Stick to the context. If uncertain, respond with I don't know.And also try to use points to display answer whenever necessary.
 
context: {context}
 
question: {question}`;
 
export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
 
    const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
 
    const currentMessageContent = messages[messages.length - 1].content;
 
    const prompt = PromptTemplate.fromTemplate(TEMPLATE);
 
    const vectorStore = await processDocsStore();
 
    const relevantVectors = await vectorStore.similaritySearch(currentMessageContent, 2);
    const contextText = relevantVectors.map((doc: any) => doc.page_content).join("\n\n---\n\n");
    console.log("relevant vectorssss", relevantVectors);
    console.log("curent message", currentMessageContent)
    // console.log("things going to llm as context", formatDocumentsAsString(relevantVectors))
    const chunkIds = getChunkIdsFromRelevantVectors(relevantVectors)
    const allChunks = getProcessedChunks();
    // console.log("all chunks", allChunks)
    const combinedVectors = createCombinedChunks(chunkIds, allChunks)
    console.log("previos current will all vecotrs", combinedVectors);
 
    const model = new ChatOllama({
      baseUrl: OLLAMA_URL,
      model: OLLAMA_MODEL,
      temperature: 0,
    });
 
    const parser = new HttpResponseOutputParser();
 
    const chain = RunnableSequence.from([
      {
        question: (input) => input.question,
        chat_history: (input) => input.chat_history,
        context: () => formatDocumentsAsString(combinedVectors),
      },
      prompt,
      model,
      parser,
    ]);
 
    // Convert the response into a friendly text-stream
    const stream = await chain.stream({
      chat_history: formattedPreviousMessages.join('\n'),
      question: currentMessageContent,
    });
 
    // Respond with the stream
    return new StreamingTextResponse(
      stream.pipeThrough(createStreamDataTransformer()),
    );
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: e.status ?? 500 });
  }
}
 
function getChunkIdsFromRelevantVectors(relevantVectors: any) {
  const chunkIds = relevantVectors.map((vector: any) => vector.metadata.id);
  return chunkIds;
}
 
function createCombinedChunks(chunkIds: any, allChunks: any) {
  return chunkIds.map((chunkId: any) => {
    const currentChunkIndex = allChunks.findIndex((chunk: any) => chunk.metadata.id === chunkId);
    const previousChunk = allChunks[currentChunkIndex - 1] || null;
    const currentChunk = allChunks[currentChunkIndex];
    const nextChunk = allChunks[currentChunkIndex + 1] || null;
 
    const combinedPageContent = [
      previousChunk?.pageContent || '',
      currentChunk.pageContent,
      nextChunk?.pageContent || ''
    ].filter(Boolean).join('\n\n---\n\n');
    const combinedMetadata = { ...currentChunk.metadata };
    const combinedChunk = new Document({
      pageContent: combinedPageContent,
      metadata: combinedMetadata
    });
    return combinedChunk;
  });
}