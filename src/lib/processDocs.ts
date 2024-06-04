import { DirectoryLoader,  } from "langchain/document_loaders/fs/directory";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { Document } from "@langchain/core/documents";

const directoryLoader = new DirectoryLoader(
    "src/data",
    {
        ".pdf": (path: string) => new PDFLoader(path),
    }
);

const processDocsSingleton = async (): Promise<Document[]> => {
    console.log("Processing Docs:::");
    const loadedDocs = await directoryLoader.load();
    console.log("Processing Completed:::");
    return loadedDocs;
}

declare const globalThis: {
    processedDocs: Document[]
} & typeof global;

const processDocs = async () => {
    return globalThis.processedDocs = globalThis.processedDocs ?? await processDocsSingleton();
}

export default processDocs;