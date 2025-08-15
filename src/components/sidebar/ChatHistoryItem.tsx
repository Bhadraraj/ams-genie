import React from 'react';
import { ChatHistory } from '../../types';

interface ChatHistoryItemProps {
  chat: ChatHistory;
  isActive: boolean;
  onClick: () => void;
}

const ChatHistoryItem: React.FC<ChatHistoryItemProps> = ({ 
  chat, 
  isActive, 
  onClick 
}) => {
  return (
    <div
      className={`cardMain p-4 cursor-pointer transition-all duration-200 border-l-4 ${
        isActive 
          ? 'bg-blue-600/30 border-l-blue-400 shadow-md ring-1 ring-blue-400/50' 
          : 'border-l-transparent hover:bg-blue-900/20 hover:border-l-blue-600'
      }`}
      onClick={onClick}
    >
      <h3 className={`font-medium transition-colors ${
        isActive ? 'text-blue-200' : 'text-white'
      }`}>
        {chat.title}
      </h3>
      <p className={`text-sm mt-1 transition-colors ${
        isActive ? 'text-blue-300' : 'text-gray-400'
      }`}>
        {chat.timestamp}
      </p>
    </div>
  );
};

export default ChatHistoryItem;