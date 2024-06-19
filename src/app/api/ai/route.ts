import { PromptTemplate } from '@langchain/core/prompts';
import { RunnableSequence } from '@langchain/core/runnables'
import { formatDocumentsAsString } from 'langchain/util/document';

import { StreamingTextResponse, Message, AIStream, LangChainAdapter, StreamData } from "ai";
import { ChatOllama } from "@langchain/community/chat_models/ollama";

import { OLLAMA_MODEL, OLLAMA_URL } from "@/lib/constants";
import processDocsStore from '@/lib/processDocs';


export const dynamic = "force-dynamic";

/**
 * Basic memory formatter that stringifies and passes
 * message history directly into the model.
 */
const formatMessage = (message: Message) => {
  return `${message.role}: ${message.content}`;
};

const DONT_KNOW_MESSAGE = `I am not aware of the answer to the question.
Please contact the HR team for assistance.
Email: HR_BP@REALPAGE.COM`;

const SYSTEM_TEMPLATE = `You are a HR assistant chatbot. Your primary task is to answer questions based STRICTLY on the provided context.
Context information is below.
---------------------
context: {context}
---------------------
RULES:
- ONLY answer if the question relates directly to the provided context.
- Do NOT provide information that is not explicitly mentioned in the context. Avoid speculating or adding details from outside the context.
- If the question does NOT directly match with the context, respond with {dont_know_message}.
- If no context is provided, always respond with {dont_know_message}.
- Dont express something like according to context etc, just try to answer user questions in a human way according to the context.
- If the question is a greeting (like "Hello", "Hi", etc.), respond with a corresponding greeting.
 
Remember: Stick to the context. If uncertain, respond with {dont_know_message}. And also try to use points to display answer whenever necessary.

chat_history: {chat_history} 

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

    const retriever = await processDocsStore();

    const revelentDocs = await retriever.invoke(currentMessage.content);

    console.log("::::::::::::::::::relevant Docs :::::::::::::", revelentDocs);

    const chain = RunnableSequence.from([
      {
        question: (input) => input.question,
        context: (input) => formatDocumentsAsString(input.context),
        chat_history: (input) => input.chat_history,
        dont_know_message: (input) => input.dont_know_message,
      },
      PromptTemplate.fromTemplate(SYSTEM_TEMPLATE),
      new ChatOllama({
        baseUrl: OLLAMA_URL,
        model: OLLAMA_MODEL,
        temperature: 0,
      }),
    ]);

    // Convert the response into a friendly text-stream
    const stream = await chain.stream({
      question: currentMessage.content,
      chat_history: formattedPreviousMessages.join('\n'),
      context: revelentDocs,
      dont_know_message: DONT_KNOW_MESSAGE,
    });

    const aiStream = LangChainAdapter.toAIStream(stream);

    // Respond with the stream
    return new StreamingTextResponse(aiStream);
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: e.status ?? 500 });
  }
}