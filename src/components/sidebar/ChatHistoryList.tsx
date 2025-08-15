import React, { useState, useEffect } from 'react';
import { useChat } from '../../context/ChatContext';
import ChatHistoryItem from './ChatHistoryItem';

interface ChatHistory {
  chatId: string;
  chatSummary: string;
  lastUpdatedTime: string;
  userId: string;
}

interface ChatHistoryListProps {
  onChatSelect: () => void;
}

const ChatHistoryList: React.FC<ChatHistoryListProps> = ({ onChatSelect }) => {
  const { setCurrentChat, currentChat, searchTerm, setChatHistory, shouldRefetch } = useChat();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userId = "babu.s@sirc.sa";

  const fetchChatHistory = async () => {
    try {
      setLoading(true);
      console.log('Fetching chat history...');
      
      const response = await fetch(`https://api-config.amsgenius.com/api/chat_history/${encodeURIComponent(userId)}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: ChatHistory[] = await response.json();
      console.log('API Response:', data);
      
      setChatHistory(data);
      setError(null);
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to load History');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChatHistory();
  }, [userId, shouldRefetch, setChatHistory]);

  // Enhanced chat loading with better message ordering
  const handleChatClick = async (chat: ChatHistory) => {
    setCurrentChat(null); 
    
    try {
      const response = await fetch(`https://api-config.amsgenius.com/api/chat/${encodeURIComponent(chat.chatId)}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const fullChatData = await response.json();
      
      if (!fullChatData || fullChatData.length === 0) {
        throw new Error("No chat data found for this ID.");
      }

      console.log("Raw chat data:", fullChatData);

      // Sort messages by creation date to ensure proper chronological order
      const sortedChatData = fullChatData.sort((a, b) => {
        return new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime();
      });

      console.log("Sorted chat data:", sortedChatData);

      // Group messages by user and system pairs based on sequence and timing
      const messageGroups = [];
      let currentGroup = [];
      
      sortedChatData.forEach((item, index) => {
        // If this is a new sequence or significant time gap, start new group
        const prevItem = sortedChatData[index - 1];
        const isNewSequence = !prevItem || item.chatSeq !== prevItem.chatSeq;
        const timeDiff = prevItem ? 
          new Date(item.createdDate).getTime() - new Date(prevItem.createdDate).getTime() : 0;
        
        // Start new group if sequence changed or time gap > 30 seconds
        if (isNewSequence || timeDiff > 30000) {
          if (currentGroup.length > 0) {
            messageGroups.push([...currentGroup]);
          }
          currentGroup = [item];
        } else {
          currentGroup.push(item);
        }
      });
      
      // Add the final group
      if (currentGroup.length > 0) {
        messageGroups.push(currentGroup);
      }

      console.log("Message groups:", messageGroups);

      // Convert groups to message pairs (user question + system response)
      const formattedMessages = [];
      
      messageGroups.forEach((group, groupIndex) => {
        // Take the first item as the user message (original question)
        const firstItem = group[0];
        
        // Use the last item as the system response (most recent solution)
        const lastItem = group[group.length - 1];
        
        // Add user message
        const userMessage = {
          id: `${firstItem.id}-user-${groupIndex}`,
          content: firstItem.errorDescription,
          sender: 'user',
          timestamp: firstItem.createdDate,
        };

        // Add system response
        const systemMessage = {
          id: `${lastItem.id}-system-${groupIndex}`,
          content: lastItem.solution,
          sender: 'system',
          timestamp: lastItem.createdDate,
        };

        formattedMessages.push(userMessage, systemMessage);
      });

      console.log("Formatted messages:", formattedMessages);

      // Find the highest sequence number for next message
      const maxSeq = Math.max(...sortedChatData.map(item => item.chatSeq || 0));

      setCurrentChat(
        { 
          id: chat.chatId,
          title: chat.chatSummary, 
          lastMessage: chat.chatSummary, 
          timestamp: chat.lastUpdatedTime,
          seq: maxSeq // Use the highest sequence number
        }, 
        formattedMessages
      );
      
      console.log("✅ Chat loaded successfully:", {
        chatId: chat.chatId,
        maxSeq: maxSeq,
        messageCount: formattedMessages.length,
        title: chat.chatSummary
      });
      
      onChatSelect();
    } catch (err) {
      console.error('Error fetching full chat:', err);
    }
  };

  const { filteredChatHistory } = useChat();

  // Helper function to sort chats by most recent first
  const sortChatsByMostRecent = (chats: ChatHistory[]) => {
    return chats
      .slice() // Create a copy to avoid mutating original array
      .sort((a, b) => {
        // Convert timestamps to Date objects for comparison
        const dateA = new Date(a.lastUpdatedTime);
        const dateB = new Date(b.lastUpdatedTime);
        
        // Sort in descending order (most recent first)
        return dateB.getTime() - dateA.getTime();
      });
  };

  if (loading) {
    return (
      <div className="p-4 text-center text-gray-400">Loading chat history...</div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-400">Error: {error}</div>
    );
  }

  // Get sorted chats (most recent first)
  const sortedChats = sortChatsByMostRecent(filteredChatHistory);

  console.log('🕒 Chat sorting debug:', {
    originalCount: filteredChatHistory.length,
    sortedCount: sortedChats.length,
    firstChat: sortedChats[0]?.chatSummary + ' - ' + sortedChats[0]?.lastUpdatedTime,
    lastChat: sortedChats[sortedChats.length - 1]?.chatSummary + ' - ' + sortedChats[sortedChats.length - 1]?.lastUpdatedTime
  });

  return (
    <div className="divide-y divide-blue-900 cardMain">
      {sortedChats.length > 0 ? (
        sortedChats.map((chat) => (
          <ChatHistoryItem
            key={chat.chatId}
            chat={{ 
              id: chat.chatId, 
              title: chat.chatSummary, 
              timestamp: chat.lastUpdatedTime, 
              lastMessage: '' 
            }}
            isActive={currentChat?.id === chat.chatId}
            onClick={() => handleChatClick(chat)}
          />
        ))
      ) : (
        <div className="p-4 text-center text-gray-400">
          {searchTerm ? `No chats found for "${searchTerm}"` : 'No chat history found'}
        </div>
      )}
    </div>
  );
};

export default ChatHistoryList;