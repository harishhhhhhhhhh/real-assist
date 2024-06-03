const OLLAMA_URL = process.env.NEXT_PUBLIC_OLLAMA_URL || 'http://localhost:11434'
const OLLAMA_MODEL = process.env.NEXT_PUBLIC_OLLAMA_MODEL || 'mistral'

export {
    OLLAMA_URL,
    OLLAMA_MODEL,
}