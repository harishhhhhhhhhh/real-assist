import { PromptTemplate } from '@langchain/core/prompts';
import { HttpResponseOutputParser } from 'langchain/output_parsers';
import { RunnableSequence } from '@langchain/core/runnables'
import { formatDocumentsAsString } from 'langchain/util/document';

import { StreamingTextResponse, Message, createStreamDataTransformer, AIStream } from "ai";
import { ChatOllama } from "@langchain/community/chat_models/ollama";
//import { AIMessage, HumanMessage } from "@langchain/core/messages";
// import { BytesOutputParser } from "@langchain/core/output_parsers";

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

const TEMPLATE = `You are a chatbot for ansering employee questions. 

Reference: {context}

Question: {question}

Use the reference to answer the question.

The question is only fraction of above reference.

Be informative, gentle, and formal.

Don't say 'Based on' while answering

If you can't answer the question with the reference, just say like 
'I couldn't find the right answer please get in touch with HR Team'.`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);

    const currentMessage = messages[messages.length - 1];

    if (currentMessage.content.startsWith('@')) {
      const response = new Response(null, {status: 204})
      const stream = AIStream(response);
      // Respond with the stream
      return new StreamingTextResponse(stream);
    }

    const prompt = PromptTemplate.fromTemplate(TEMPLATE);

    const vectorStore = await processDocsStore();

    const relevantVectors = await vectorStore.similaritySearch(currentMessage.content, 3);

    const model = new ChatOllama({
      baseUrl: OLLAMA_URL,
      model: OLLAMA_MODEL,
      temperature: 0,
    });

    const parser = new HttpResponseOutputParser();

    const chain = RunnableSequence.from([
      {
        question: (input) => input.question,
        //chat_history: (input) => input.chat_history,
        context: () => formatDocumentsAsString(relevantVectors),
      },
      prompt,
      model,
      parser,
    ]);

    // Convert the response into a friendly text-stream
    const stream = await chain.stream({
      chat_history: formattedPreviousMessages.join('\n'),
      question: currentMessage.content,
    });

    // Respond with the stream
    return new StreamingTextResponse(
      stream.pipeThrough(createStreamDataTransformer()),
    );
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: e.status ?? 500 });
  }
}