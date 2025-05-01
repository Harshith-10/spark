'use client';

import { useState, useRef, useEffect, useReducer, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Lightbulb, BookOpen, History, Info, ChevronRight, MessageSquare, Sparkles, Brain, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from '@/lib/utils';
import Markdown from 'react-markdown';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

// Sample conversation starters
const conversationStarters = [
  {
    icon: <Lightbulb className="h-5 w-5" />,
    title: "Explain a concept",
    message: "Can you explain the Pythagorean theorem?",
  },
  {
    icon: <BookOpen className="h-5 w-5" />,
    title: "Study assistance",
    message: "How should I prepare for a math test?",
  },
  {
    icon: <Info className="h-5 w-5" />,
    title: "Ask for clarification",
    message: "I don't understand how to solve quadratic equations.",
  },
  {
    icon: <Sparkles className="h-5 w-5" />,
    title: "Practice questions",
    message: "Give me some practice questions about photosynthesis.",
  },
];

// Define message types
interface Message {
  id: string;
  text: string;
  thought?: string;  // Optional field to store thinking content
  sender: 'user' | 'ai';
  timestamp: Date;
  isThinking?: boolean; // Track if thinking is still in progress
}

interface OllamaMessage {
  role: 'user' | 'assistant';
  content: string;
}

// Ollama API interfaces
interface OllamaRequest {
  model: string;
  messages: OllamaMessage[];
  stream?: boolean;
}

// interface OllamaResponse {
//   message: {
//     role: 'assistant';
//     content: string;
//   };
//   done: boolean;
// }

interface Prompt {
  text: string;
  chatHistory: Message[];
}

// Sample chat history
const initialChatHistory: Message[] = [
  {
    id: '1',
    text: "Hello! I'm Spark, your AI Tutor. How can I help you with your studies today?",
    sender: 'ai',
    timestamp: new Date(Date.now()),
  },
];

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

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>(initialChatHistory);
  const [inputMessage, setInputMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [openCollapseIds, setOpenCollapseIds] = useState<Set<string>>(new Set());
  const [thinkModeEnabled, setThinkModeEnabled] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const defaultApiUrl = 'http://localhost:11434';
  const [ollamaApiUrl, setOllamaApiUrl] = useState<string>(defaultApiUrl);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [newApiUrl, setNewApiUrl] = useState('');
  const defaultModel = 'spark';

  const [promptQueue, dispatch] = useReducer(promptQueueReducer, [] as Prompt[]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Load API URL from localStorage on initial render
  useEffect(() => {
    // Only run on client-side
    if (typeof window !== 'undefined') {
      const savedUrl = localStorage.getItem('ollamaApiUrl');
      if (savedUrl) {
        setOllamaApiUrl(savedUrl);
        setNewApiUrl(savedUrl);
      } else {
        setNewApiUrl(defaultApiUrl);
      }
    }
  }, [defaultApiUrl]);

  // Function to toggle the think mode
  const toggleThinkMode = () => {
    setThinkModeEnabled((prev) => !prev);
  };

  // Function to communicate with Ollama API - memoized with useCallback
  const fetchOllamaResponse = useCallback(async (userMessage: string, chatHistory: Message[]): Promise<void> => { // Promise<string> => {
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

            // Auto-collapse the thinking section when done
            setOpenCollapseIds(prev => {
              const newSet = new Set(prev);
              if (responseMessage && newSet.has(responseMessage.id)) {
                newSet.delete(responseMessage.id);
              }
              return newSet;
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
  }, [ollamaApiUrl, defaultModel]);

  // Use effect to process the queue whenever it changes
  useEffect(() => {
    // Function to process the prompt queue
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

  // Auto-expand thinking sections when they appear
  useEffect(() => {
    messages.forEach(message => {
      if (message.isThinking && message.thought) {
        setOpenCollapseIds(prev => {
          const newSet = new Set(prev);
          newSet.add(message.id);
          return newSet;
        });
      }
    });
  }, [messages]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus textarea on load
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  // Handle sending a message
  const handleSendMessage = async (text: string = inputMessage) => {
    if (!text.trim()) return;
    
    // If think mode is disabled, add "/no_think" to the beginning of the message
    const processedText = !thinkModeEnabled ? `/no_think ${text.trim()}` : text.trim();

    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(), // Display original text to user without the /no_think prefix
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setInputMessage('');

    dispatch({
      type: ADD_PROMPT,
      payload: { text: processedText, chatHistory: [...messages, newUserMessage] },
    });
  };

  // Handle pressing Enter key in textarea
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Auto-resize textarea
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputMessage(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  // /no_think

  // Clear the chat
  const handleClearChat = () => {
    setMessages([
      {
        id: Date.now().toString(),
        text: "I'm here to help! What would you like to learn about?",
        sender: 'ai',
        timestamp: new Date(),
      },
    ]);
  };

  // Handle opening settings dialog
  const handleOpenSettings = () => {
    setNewApiUrl(ollamaApiUrl);
    setIsSettingsOpen(true);
  };

  // Handle saving settings
  const handleSaveSettings = () => {
    if (newApiUrl && newApiUrl !== ollamaApiUrl) {
      setOllamaApiUrl(newApiUrl);
      localStorage.setItem('ollamaApiUrl', newApiUrl);
      setErrorMessage(null); // Clear any existing error messages
    }
    setIsSettingsOpen(false);
  };

  // Format message timestamp
  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days}d ago`;
    } else if (hours > 0) {
      return `${hours}h ago`;
    } else if (minutes > 0) {
      return `${minutes}m ago`;
    } else {
      return 'Just now';
    }
  };

  const toggleCollapse = (id: string) => {
    setOpenCollapseIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="h-[calc(100vh-120px)]"
    >
      <div className="grid md:grid-cols-4 gap-6 h-full">
        {/* Left sidebar */}
        <div className="hidden md:block md:col-span-1">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle className="text-xl">Spark AI</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col h-full space-y-4">
              {/* New chat button */}
              <Button
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white justify-start"
                onClick={handleClearChat}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                New conversation
              </Button>

              {/* Conversation starters */}
              <div className="mt-6">
                <h3 className="text-sm font-medium mb-2">Suggested questions</h3>
                <div className="space-y-2">
                  {conversationStarters.map((starter, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSendMessage(starter.message)}
                      className="w-full flex items-center justify-between p-3 text-left rounded-md border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center">
                        <div className="h-8 min-w-[32] rounded-full bg-yellow-500/10 flex items-center justify-center mr-3">
                          {starter.icon}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{starter.title}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1">{starter.message}</p>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Previous chats (would be dynamic in real app) */}
              <div className="mt-6">
                <h3 className="text-sm font-medium mb-2">Recent conversations</h3>
                <div className="space-y-1">
                  <button className="w-full flex items-center p-2 text-left rounded-md hover:bg-muted transition-colors">
                    <History className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm truncate">Algebra help</span>
                  </button>
                  <button className="w-full flex items-center p-2 text-left rounded-md hover:bg-muted transition-colors">
                    <History className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm truncate">Biology concepts</span>
                  </button>
                </div>
              </div>

              <div className="mt-auto pt-4 border-t">
                <p className="text-xs text-muted-foreground">
                  Spark AI is here to help with your learning needs. Ask questions about concepts, request practice problems, or get help with specific subjects.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main chat area */}
        <Card className="md:col-span-3 flex flex-col h-full overflow-hidden">
          {/* Fixed header */}
          <CardHeader className="border-b pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-yellow-500/10 flex items-center justify-center mr-3">
                  <Bot className="h-4 w-4 text-yellow-500" />
                </div>
                <CardTitle className="text-xl">New conversation</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleOpenSettings}
                title="Configure Ollama API URL"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
            {errorMessage && (
              <div className="mt-2 p-2 bg-red-100 text-red-700 text-sm rounded-md flex items-center">
                <span className="mr-1">⚠️</span>
                {errorMessage}
              </div>
            )}
          </CardHeader>

          {/* Scrollable messages area */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full px-4">
              <div className="space-y-4">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={cn(
                        "flex",
                        message.sender === 'user' ? "justify-end" : "justify-start"
                      )}
                    >
                      <div className={cn(
                        "flex max-w-[80%] md:max-w-[70%]",
                        message.sender === 'user' ? "flex-row-reverse" : "flex-row"
                      )}>
                        <div className={cn(
                          "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full",
                          message.sender === 'user'
                            ? "bg-yellow-500 text-white ml-2"
                            : "bg-muted mr-2"
                        )}>
                          {message.sender === 'user' ? (
                            <User className="h-4 w-4" />
                          ) : (
                            <Bot className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          {message.sender === 'ai' && message.thought && message.thought.trim() && (
                            <Collapsible
                              className="mt-1 mb-2"
                              open={openCollapseIds.has(message.id)}
                              onOpenChange={() => toggleCollapse(message.id)}
                            >
                              <div className="flex items-center">
                                <CollapsibleTrigger className="flex items-center text-xs text-muted-foreground hover:text-foreground">
                                  <ChevronRight className={'h-3 w-3 mr-1 transition-all transform ' + (openCollapseIds.has(message.id) ? 'rotate-90' : 'rotate-0')} />
                                  <span className='flex items-center'>Thought process</span>
                                  {message.isThinking && <div
                                    className="ml-1 w-3 h-3 border-2 border-t-yellow-500 border-transparent rounded-full animate-spin"
                                  ></div>}
                                </CollapsibleTrigger>
                              </div>
                              <AnimatePresence>
                                <CollapsibleContent className="mt-1 bg-yellow-500/10 rounded-md p-2">
                                  <div className="text-xs text-yellow-700 dark:text-yellow-500 whitespace-pre-wrap">
                                    {message.thought.trim()}
                                  </div>
                                </CollapsibleContent>
                              </AnimatePresence>
                            </Collapsible>
                          )}
                          {message.text &&
                            <div className={cn(
                              "rounded-lg px-4 py-3",
                              message.sender === 'user'
                                ? "bg-yellow-500 text-white"
                                : "bg-muted"
                            )}>
                              <Markdown>
                                {message.text}
                              </Markdown>
                            </div>
                          }
                          <div className={cn(
                            "mt-1 text-xs",
                            message.sender === 'user' ? "text-right" : "",
                            "text-muted-foreground"
                          )}>
                            {formatTimestamp(message.timestamp)}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </div>

          {/* Fixed input area */}
          <CardContent className="p-4 border-t mt-auto">
            <div className="flex items-center justify-start mb-2">
              <div className="flex items-center space-x-2">
                <Label
                  htmlFor="think-mode"
                  className={`flex items-center border px-2 py-1 rounded-full cursor-pointer ${thinkModeEnabled ? 'border-yellow-500 text-yellow-500' : 'text-muted-foreground'}`}
                  onClick={toggleThinkMode}
                >
                  <Brain className="h-4 w-4" />
                  <span className="text-sm">Think</span>
                </Label>
              </div>
            </div>
            <div className="relative">
              <Textarea
                ref={textareaRef}
                placeholder="Ask your question..."
                value={inputMessage}
                onChange={handleTextareaChange}
                onKeyDown={handleKeyDown}
                className="pr-12 resize-none overflow-hidden min-h-[49px] max-h-[120px]"
                rows={1}
              />
              <Button
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || isProcessing}
                className="absolute right-2 -translate-y-10 h-8 w-8 p-0 bg-yellow-500 hover:bg-yellow-600"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <div className="flex flex-wrap gap-1">
                <Badge variant="outline" className="text-xs rounded-sm px-1 py-0">Enter to send</Badge>
                <Badge variant="outline" className="text-xs rounded-sm px-1 py-0">Shift + Enter for new line</Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-xs"
                onClick={handleClearChat}
              >
                Clear chat
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Settings dialog */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Label htmlFor="api-url">API URL</Label>
            <Input
              id="api-url"
              value={newApiUrl}
              onChange={(e) => setNewApiUrl(e.target.value)}
              placeholder="Enter API URL"
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsSettingsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveSettings}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}