import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import { ChatHistory, Message } from "../types";
import { mockChatHistory, mockMessages } from "../data/mockData";

interface ChatContextType {
  currentChat: ChatHistory | null;
  chatHistory: ChatHistory[];
  messages: Message[];
  setCurrentChat: (chat: ChatHistory | null, messages?: Message[]) => void;
  filteredChatHistory: ChatHistory[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sendMessage: (content: string, sender?: 'user' | 'system') => void;
  createTicket: (priority: string, module: string) => void;
  startNewChat: () => void;
  initialTicketDescription: string | null;
  setInitialTicketDescription: (description: string | null) => void;
  refetchChatHistory: () => void;
  setChatId: (id: string) => void;
  updateChatSequence: (seq: number) => void;
  shouldRefetch: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentChat, setCurrentChatState] = useState<ChatHistory | null>(
    null
  );
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [initialTicketDescription, setInitialTicketDescription] = useState<
    string | null
  >(null);
  const [shouldRefetch, setShouldRefetch] = useState(false);

  const refetchChatHistory = useCallback(() => {
    setShouldRefetch(prev => !prev);
  }, []);

  const updateChatSequence = (seq: number) => {
    if (currentChat) {
      setCurrentChatState({ ...currentChat, seq });
    }
  };

  const setChatId = (id: string) => {
    if (currentChat) {
      setCurrentChatState({ ...currentChat, id });
    }
  };

  const handleSetCurrentChat = (
    chat: ChatHistory | null,
    newMessages?: Message[]
  ) => {
    setCurrentChatState(chat);
    if (newMessages) {
      setMessages(newMessages);
    } else if (chat) {
      setMessages([]);
    } else {
      setMessages([]);
    }
    setInitialTicketDescription(null);
  };

  const sendMessage = (content: string, sender: 'user' | 'system' = 'user') => {
    if (!content.trim()) return;

    const newMessage: Message = {
      id: String(Date.now()),
      content,
      sender,
      timestamp: new Date().toISOString(),
    };

    setMessages(prevMessages => [...prevMessages, newMessage]);
    
    if (sender === 'user') {
      setInitialTicketDescription(content);
    }
  };

  const startNewChat = () => {
    setCurrentChatState(null);
    setMessages([]);
    setInitialTicketDescription(null);
  };

  const createTicket = (priority: string, module: string) => {
    console.log("Creating ticket with priority:", priority, "and module:", module);
  };

  const value = {
    currentChat,
    chatHistory,
    messages,
    setCurrentChat: handleSetCurrentChat,
    filteredChatHistory: chatHistory.filter((chat) =>
      chat.chatSummary.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    searchTerm,
    setSearchTerm,
    sendMessage,
    createTicket,
    startNewChat,
    initialTicketDescription,
    setInitialTicketDescription,
    refetchChatHistory,
    setChatId,
    updateChatSequence,
    shouldRefetch,
    setChatHistory,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};