// Define message types
export interface Message {
    id: string;
    text: string;
    thought?: string;  // Optional field to store thinking content
    sender: 'user' | 'ai';
    timestamp: Date;
    isThinking?: boolean; // Track if thinking is still in progress
}

// Ollama API interfaces
export interface OllamaMessage {
    role: 'user' | 'assistant';
    content: string;
}

export interface OllamaRequest {
    model: string;
    messages: OllamaMessage[];
    stream?: boolean;
}

export interface Prompt {
    text: string;
    chatHistory: Message[];
}
