import { DirectoryLoader, } from "langchain/document_loaders/fs/directory";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { Document } from "@langchain/core/documents";
import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";

import { OLLAMA_EMBEDDINGS_MODEL, OLLAMA_URL } from "./constants";

declare const globalThis: {
    store: {
        vectorStore: MemoryVectorStore;
        allChunks: Document[];
    }
} & typeof global;

async function addToVectorDb(allChunks: any) {
    const embeddings = new OllamaEmbeddings({
        model: OLLAMA_EMBEDDINGS_MODEL,
        baseUrl: OLLAMA_URL,
    })

    const chunkTexts = allChunks.map((chunk: Document) => chunk.pageContent);
    const metadatas = allChunks.map((chunk: Document) => chunk.metadata);

    const vectorStore = await MemoryVectorStore.fromTexts(chunkTexts, metadatas, embeddings);

    return {
        vectorStore,
        allChunks,
    }
}

const processDocsSingleton = async () => {
    console.log("Processing Docs:::");
    const directoryLoader = new DirectoryLoader("src/data", {
        ".pdf": (path: string) => new PDFLoader(path)
    });
    const loadedDocs = await directoryLoader.load();
    console.log("Docs loaded")
    const chunks = await splitDocuments(loadedDocs);
    console.log("chunks completed");
    const allChunks = calculateChunkIds(chunks)
    const store = await addToVectorDb(allChunks);
    console.log("Processing Completed:::");
    return store;
}

const splitDocuments = (documents: any[]) => {
    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 300,
        chunkOverlap: 50,
        lengthFunction: (text: string) => text.length,
    });

    return textSplitter.splitDocuments(documents);
}

const calculateChunkIds = (chunks: any) => {
    for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        const source = chunk.metadata.source;

        // Use the chunk index as the identifier
        const chunkId = `${source}:${i}`;

        // Add the chunk ID to the metadata
        chunk.metadata.id = chunkId;
    }
    return chunks;
}

const processDocsStore = async (reset: boolean = false) => {
    return globalThis.store = (reset ?
        await processDocsSingleton() :
        globalThis.store ?? await processDocsSingleton()
    );
}

export default processDocsStore;