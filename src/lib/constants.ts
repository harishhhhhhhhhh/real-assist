const ROOT_PATH = 'http://localhost:3000';
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'mistral';
const OLLAMA_EMBEDDING_MODEL = process.env.OLLAMA_EMBEDDING_MODEL || 'mxbai-embed-large';

export {
    ROOT_PATH,
    OLLAMA_URL,
    OLLAMA_MODEL,
    OLLAMA_EMBEDDING_MODEL,
}