import fs from 'fs';
import path from 'path';
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { MemoryVectorStore } from "langchain/vectorstores/memory";

const CHROMA_URL = 'http://localhost:8000';
const CHROMA_COLLECTION_NAME = 'documents';
const DATA_PATH = './src/data';

interface Document {
    pageContent: string;
    metadata: {
        source: string;
        pdf: object;
        loc: object;
    };
}


// Function to generate embeddings using Ollama
async function embedText(text: string[]): Promise<number[][]> {
    const embeddings = new OllamaEmbeddings({
        model: "mxbai-embed-large",
        baseUrl: "http://localhost:11434",
    });

    return await embeddings.embedDocuments(text);
}

// Function to load PDF documents from the data folder
async function loadDocuments() {
    const loader = new DirectoryLoader(
        DATA_PATH,
        {
            ".pdf": (path) => new PDFLoader(path)
        }
    );
    const docs = await loader.load();
    return docs
}

// Function to split documents into chunks
function splitDocuments(documents: any[]) {
    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 800,
        chunkOverlap: 80,
        lengthFunction: (text: string) => text.length,
    });

    return textSplitter.splitDocuments(documents);
}

// Function to add chunks to Chroma
async function addToChroma(chunks: any) {
    const embeddings = new OllamaEmbeddings({
        model: "mxbai-embed-large",
        baseUrl: "http://localhost:11434",
    })

    const chunkTexts = chunks.map((chunk: Document) => chunk.pageContent);
    const metadatas = chunks.map((chunk: Document) => chunk.metadata);  // Use the actual metadata from each chunk

    const vectorStore = await MemoryVectorStore.fromTexts(chunkTexts, metadatas, embeddings);
    // const response = await vectorStore.similaritySearch("how to refer someone", 3);
    // console.log("repisne", response)

    return vectorStore
}


export async function indexDocuments() {
    const documents = await loadDocuments();
    const chunks = await splitDocuments(documents);
    const store = await addToChroma(chunks);

    console.log('Documents indexed successfully.');
    return store;
}
