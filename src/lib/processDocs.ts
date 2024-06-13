import { DirectoryLoader, } from "langchain/document_loaders/fs/directory";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { Document } from "@langchain/core/documents";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";
import { OLLAMA_EMBEDDINGS_MODEL, OLLAMA_URL } from "./constants";

const directoryLoader = new DirectoryLoader(
    "src/data",
    {
        ".pdf": (path: string) => new PDFLoader(path),
    }
);

async function addToVectorDb(chunks: any) {
    const embeddings = new OllamaEmbeddings({
        model: OLLAMA_EMBEDDINGS_MODEL,
        baseUrl: OLLAMA_URL,
    })

    const chunkTexts = chunks.map((chunk: Document) => chunk.pageContent);
    const metadatas = chunks.map((chunk: Document) => chunk.metadata);

    const vectorStore = await MemoryVectorStore.fromTexts(chunkTexts, metadatas, embeddings);

    return vectorStore
}

const processDocsSingleton = async () => {
    console.log("Processing Docs:::");
    const loadedDocs = await directoryLoader.load();
    console.log("Docs loaded")
    const chunks = await splitDocuments(loadedDocs);
    console.log("chunks completed")
    globalThis.allChunks = calculateChunkIds(chunks)
    const store = await addToVectorDb(globalThis.allChunks);
    console.log("Processing Completed:::");
    return store;
}

const splitDocuments = (documents: any[]) => {
    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 100,
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

export function getProcessedChunks() {
    return globalThis.allChunks;
}

declare const globalThis: {
    store: any;
    allChunks: any;
} & typeof global;
 
 
const processDocsStore = async () => {
    return globalThis.store = globalThis.store ?? await processDocsSingleton();
}

export default processDocsStore;