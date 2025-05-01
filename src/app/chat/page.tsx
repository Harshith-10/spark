'use client';

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

// Import custom hooks
import { useChatMessages } from '@/hooks/use-chat-messages';
import { useOllamaApi } from '@/hooks/use-ollama-api';
import { useOllamaSettings } from '@/hooks/use-ollama-settings';

// Import types
import { Message } from '@/types/messages';

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

export default function Chat() {
  // Use our custom hooks
  const {
    messages,
    setMessages,
    inputMessage,
    setInputMessage,
    thinkModeEnabled,
    openCollapseIds,
    messagesEndRef,
    textareaRef,
    toggleThinkMode,
    handleClearChat,
    handleTextareaChange,
    toggleCollapse,
    formatTimestamp
  } = useChatMessages();

  const {
    ollamaApiUrl,
    newApiUrl,
    setNewApiUrl,
    isSettingsOpen,
    setIsSettingsOpen,
    errorMessage,
    setErrorMessage,
    handleOpenSettings,
    handleSaveSettings
  } = useOllamaSettings();

  const { isProcessing, addMessageToQueue } = useOllamaApi(ollamaApiUrl, setMessages, setErrorMessage);

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

    addMessageToQueue(processedText, [...messages, newUserMessage]);
  };

  // Handle pressing Enter key in textarea
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
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
              <div className="mt-2 p-2 bg-red-100 text-red-700 text-sm rounded-md flex items-center" onClick={() => setErrorMessage(null)}>
                <span className="mr-1">⚠️</span>
                {errorMessage + " Click to dismiss."}
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
          <CardContent className="px-4 pt-4 border-t mt-auto">
            <div className="flex items-center justify-start mb-2">
              <div className="flex items-center space-x-2">
                <Label
                  htmlFor="think-mode"
                  className={`flex gap-${thinkModeEnabled ? '2' : '1'} transition-all duration-300 items-center border px-2 py-1 rounded-full cursor-pointer ${thinkModeEnabled ? 'border-yellow-500 text-yellow-500' : 'text-muted-foreground hover:border-yellow-700'}`}
                  onClick={toggleThinkMode}
                >
                  <Brain className={`h-4 w-4 transition-transform duration-300 ${thinkModeEnabled && 'scale-115'}`} />
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