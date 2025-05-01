import { useCallback, useReducer, useState, useEffect } from 'react';
import { Message, OllamaMessage, OllamaRequest, Prompt } from '@/types/messages';

// Define action types for the reducer
const ADD_PROMPT = 'ADD_PROMPT';
const REMOVE_PROMPT = 'REMOVE_PROMPT';

// Reducer to manage the prompt queue
function promptQueueReducer(state: Prompt[], action: { type: string; payload?: Prompt }): Prompt[] {
    switch (action.type) {
        case ADD_PROMPT:
            return [...state, action.payload!];
        case REMOVE_PROMPT:
            return state.slice(1);
        default:
            return state;
    }
}

export function useOllamaApi(ollamaApiUrl: string, setMessages: React.Dispatch<React.SetStateAction<Message[]>>, setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>) {
    const defaultModel = 'spark';
    const [promptQueue, dispatch] = useReducer(promptQueueReducer, [] as Prompt[]);
    const [isProcessing, setIsProcessing] = useState(false);

    // Function to communicate with Ollama API
    const fetchOllamaResponse = useCallback(async (userMessage: string, chatHistory: Message[]): Promise<void> => {
        try {
            const ollamaMessages: OllamaMessage[] = chatHistory.map((msg) => ({
                role: msg.sender === 'user' ? 'user' : 'assistant',
                content: msg.text,
            }));

            ollamaMessages.push({
                role: 'user',
                content: userMessage,
            });

            const request: OllamaRequest = {
                model: defaultModel,
                messages: ollamaMessages,
                stream: true,
            };

            const response = await fetch(ollamaApiUrl + "/api/chat", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(request),
            });

            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }

            const reader = response.body!.getReader();
            const decoder = new TextDecoder('utf-8');
            let result = '';
            let thoughtContent = '';
            let responseMessage: Message | null = null;
            let inThinkingBlock = false;

            while (true) {
                const { done, value } = await reader.read();
                if (done) {
                    // Finished streaming - mark message as no longer thinking
                    if (responseMessage) {
                        setMessages((prevMessages) => {
                            return prevMessages.map(msg =>
                                msg.id === responseMessage!.id
                                    ? { ...msg, isThinking: false }
                                    : msg
                            );
                        });
                    }
                    break;
                }

                const chunk = decoder.decode(value, { stream: true });
                // Split by JSON objects (each line should be a complete JSON object)
                const jsonChunks = chunk.split(/\n/).filter(line => line.trim() !== '');

                for (const jsonChunk of jsonChunks) {
                    try {
                        const parsedChunk = JSON.parse(jsonChunk);
                        if (parsedChunk.message?.content) {
                            const content = parsedChunk.message.content;

                            // Process current chunk for thinking tags
                            let currentTextChunk = '';
                            let currentThoughtChunk = '';

                            // State tracking within this chunk
                            let localInThinking: boolean = inThinkingBlock;

                            for (let i = 0; i < content.length; i++) {
                                // Check for opening thinking tag
                                if (content.substring(i, i + 7) === '<think>') {
                                    localInThinking = true;
                                    i += 6; // Skip the tag
                                    continue;
                                }
                                // Check for closing thinking tag
                                else if (content.substring(i, i + 8) === '</think>') {
                                    localInThinking = false;
                                    i += 7; // Skip the tag
                                    continue;
                                }
                                // Add character to appropriate buffer
                                else if (localInThinking) {
                                    currentThoughtChunk += content[i];
                                } else {
                                    currentTextChunk += content[i];
                                }
                            }

                            // Update the global state
                            inThinkingBlock = localInThinking;

                            // Append accumulated content
                            if (currentTextChunk) result += currentTextChunk;
                            if (currentThoughtChunk) thoughtContent += currentThoughtChunk;

                            // Determine if we're actively thinking
                            const hasActiveThinking = thoughtContent.length > 0 && inThinkingBlock;

                            // Create or update message in UI with current state
                            setMessages((prevMessages) => {
                                if (responseMessage) {
                                    return prevMessages.map(msg =>
                                        msg.id === responseMessage!.id
                                            ? {
                                                ...msg,
                                                text: result,
                                                thought: thoughtContent || undefined,
                                                isThinking: hasActiveThinking || inThinkingBlock
                                            }
                                            : msg
                                    );
                                } else {
                                    const newMessage: Message = {
                                        id: Date.now().toString(),
                                        text: result,
                                        thought: thoughtContent || undefined,
                                        sender: 'ai',
                                        timestamp: new Date(),
                                        isThinking: hasActiveThinking || inThinkingBlock
                                    };
                                    responseMessage = newMessage;
                                    return [...prevMessages, newMessage];
                                }
                            });
                        }
                    } catch (e) {
                        console.error('Error parsing JSON chunk:', e);
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching response from Ollama:', error);
            setErrorMessage('Failed to connect to Ollama API. Is it running at http://localhost:11434?');
            setMessages(
                (prevMessages) => [
                    ...prevMessages,
                    {
                        id: Date.now().toString(),
                        text: "I'm sorry, I couldn't process your request at the moment. Please check if the Ollama service is running locally.",
                        sender: 'ai',
                        timestamp: new Date(),
                    },
                ]
            );
        }
    }, [ollamaApiUrl, defaultModel, setMessages, setErrorMessage]);

    // Add a message to the queue
    const addMessageToQueue = (text: string, chatHistory: Message[]) => {
        dispatch({
            type: ADD_PROMPT,
            payload: { text, chatHistory }
        });
    };

    // Process the queue whenever it changes
    useEffect(() => {
        const processQueue = async () => {
            if (isProcessing || promptQueue.length === 0) return;
            setIsProcessing(true);
            const currentPrompt = promptQueue[0];
            await fetchOllamaResponse(currentPrompt.text, currentPrompt.chatHistory);
            setIsProcessing(false);
            dispatch({ type: REMOVE_PROMPT });
        };

        processQueue();
    }, [promptQueue, isProcessing, fetchOllamaResponse]);

    return {
        isProcessing,
        addMessageToQueue
    };
}