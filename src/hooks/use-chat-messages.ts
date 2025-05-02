import { useState, useRef, useEffect } from 'react';
import { Message } from '@/types/messages';

// Sample chat history
const initialChatHistory: Message[] = [
  {
    id: '1',
    text: "Hello! I'm Spark, your AI Tutor. How can I help you with your studies today?",
    sender: 'ai',
    timestamp: new Date(Date.now()),
  },
];

export function useChatMessages() {
  const [messages, setMessages] = useState<Message[]>(initialChatHistory);
  const [openCollapseIds, setOpenCollapseIds] = useState<Set<string>>(new Set());
  const [thinkModeEnabled, setThinkModeEnabled] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto-expand thinking sections when they appear and collapse when thinking is complete
  useEffect(() => {
    messages.forEach(message => {
      if (message.sender === 'ai') {
        if (message.isThinking && message.thought) {
          // Open the collapse when the AI is thinking
          setOpenCollapseIds(prev => {
            const newSet = new Set(prev);
            newSet.add(message.id);
            return newSet;
          });
        } else if (message.thought && !message.isThinking) {
          // Close the collapse when thinking is complete
          setOpenCollapseIds(prev => {
            const newSet = new Set(prev);
            newSet.delete(message.id);
            return newSet;
          });
        }
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

  // Toggle think mode
  const toggleThinkMode = () => {
    setThinkModeEnabled((prev) => !prev);
  };

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

  // Handle textarea change with auto-resizing
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputMessage(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  // Toggle collapse function for thinking sections
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

  return {
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
  };
}