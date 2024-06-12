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
    const chunks = await splitDocuments(loadedDocs);
    const store = await addToVectorDb(chunks);
    console.log("Processing Completed:::");
    return store;
}
 
function splitDocuments(documents: any[]) {
    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 800,
        chunkOverlap: 80,
        lengthFunction: (text: string) => text.length,
    });
 
    return textSplitter.splitDocuments(documents);
}
 
declare const globalThis: {
    store: MemoryVectorStore
} & typeof global;
 
const processDocsStore = async () => {
    return globalThis.store = globalThis.store ?? await processDocsSingleton();
}
 
export default processDocsStore;