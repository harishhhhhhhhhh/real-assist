import { DirectoryLoader, } from "langchain/document_loaders/fs/directory";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { InMemoryStore } from "langchain/storage/in_memory";
import { ParentDocumentRetriever } from "langchain/retrievers/parent_document";
import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";
import { Document } from "@langchain/core/documents";
import { FunctionalTranslator, SelfQueryRetriever } from "langchain/retrievers/self_query";
import { AttributeInfo } from "langchain/schema/query_constructor";
import { HNSWLib } from "@langchain/community/vectorstores/hnswlib";
import { ContextualCompressionRetriever } from "langchain/retrievers/contextual_compression";
import { LLMChainExtractor } from "langchain/retrievers/document_compressors/chain_extract";

import { OLLAMA_EMBEDDINGS_MODEL, OLLAMA_MODEL, OLLAMA_URL } from "./constants";
import { ChatOllama } from "@langchain/community/chat_models/ollama";

declare const globalThis: {
    retriever: any;
} & typeof global;

const directoryLoader = new DirectoryLoader(
    "src/data",
    {
        ".pdf": (path: string) => new PDFLoader(path),
    }
);

const embeddingsModel = new OllamaEmbeddings({
    model: OLLAMA_EMBEDDINGS_MODEL,
    baseUrl: OLLAMA_URL,
})

const llm = new ChatOllama({
    baseUrl: OLLAMA_URL,
    model: OLLAMA_MODEL,
    temperature: 0,
})

const baseCompressor = LLMChainExtractor.fromLLM(llm);

const retriever = new ParentDocumentRetriever({
    vectorstore: new MemoryVectorStore(embeddingsModel),
    docstore: new InMemoryStore(),
    // Optional, not required if you're already passing in split documents
    parentSplitter: new RecursiveCharacterTextSplitter({
        chunkOverlap: 0,
        chunkSize: 1000,
    }),
    childSplitter: new RecursiveCharacterTextSplitter({
        chunkOverlap: 0,
        chunkSize: 150,
    }),
    documentCompressor: baseCompressor,
    // Optional `k` parameter to search for more child documents in VectorStore.
    // Note that this does not exactly correspond to the number of final (parent) documents
    // retrieved, as multiple child documents can point to the same parent.
    childK: 20,
    // Optional `k` parameter to limit number of final, parent documents returned from this
    // retriever and sent to LLM. This is an upper-bound, and the final count may be lower than this.
    parentK: 5,
});





const processDocsSingleton = async () => {
    console.log("Processing Docs:::");
    const parentDocuments = await directoryLoader.load();
    console.log("Loaded Docs:::")

    await retriever.addDocuments(parentDocuments);

    /* const vectorStore = await MemoryVectorStore.fromDocuments(
        parentDocuments,
        embeddingsModel
    );

    const retriever = new ContextualCompressionRetriever({
        baseCompressor,
        baseRetriever: vectorStore.asRetriever(),
    });
 */
    return retriever;
}

const processDocsStore = async (reset: boolean = false) => {
    return globalThis.retriever = (reset ?
        await processDocsSingleton() :
        globalThis.retriever ?? await processDocsSingleton()
    );
}

export default processDocsStore;