import React, { useState } from "react";
import SearchInput from "./SearchInput";
import ChatHistoryList from "./ChatHistoryList";
import { useChat } from "../../context/ChatContext";
import TicketPanel from "../ticket/TicketPanel";
import { Star, Plus } from "lucide-react";

interface SidebarProps {
  onChatSelect: () => void;
  onNewChat: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onChatSelect, onNewChat }) => {
  const { searchTerm, setSearchTerm, startNewChat, initialTicketDescription } = useChat(); 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isTicketOpen, setIsTicketOpen] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [showTicketModal, setShowTicketModal] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleStarClick = (rating: number) => {
    setFeedbackRating(rating);
  };

  const handleStarHover = (rating: number) => {
    setHoveredStar(rating);
  };

  const handleStarLeave = () => {
    setHoveredStar(0);
  };

  const openChat = () => {
    setIsChatOpen(true);
  };

  const toggleTicketModal = () => {
    setShowTicketModal((prev) => !prev);
  };

  const handleNewChat = () => {
    startNewChat(); 
    onNewChat(); 
  };

  return (
    <div className="h-full flex flex-col cardouter sidebarLeft">
      <div className="p-4 border-b border-blue-900">
        <button
          onClick={handleNewChat}
          className="flex items-center mb-3 justify-center  gap-2 px-3 py-1.5 text-sm card-border font-medium rounded transition-colors w-full hover:bg-blue-600/20"
          title="Start new chat"
        >
          <Plus className="w-4 h-4" />
          New Chat
        </button>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Chat history</h2>
        </div>
        <SearchInput
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onClear={() => setSearchTerm("")}
          placeholder="Search"
        />
      </div>
      <div className="overflow-y-auto max-h-[35vh] pr-2 space-y-4 py-4 custom-scrollbar">
        <ChatHistoryList onChatSelect={onChatSelect} />
      </div>
      <div className="p-4 border-t border-blue-900">
        <p className="text-center font-semibold mb-4">
          Does this resolve your issue?
        </p>
        <div className="flex justify-center gap-1 text-center">
          <button
            onClick={toggleTicketModal}
            className="py-1.5 px-3 text-sm card-border font-medium rounded transition-colors"
          >
            I want to create a ticket
          </button>
        </div>
        <div className="mb-4 mt-5">
          <p className="text-white mb-2 text-center">Rate your experience:</p>
          <div className="flex justify-center gap-1 text-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-5 h-5 cursor-pointer transition-colors ${
                  star <= (hoveredStar || feedbackRating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-400 hover:text-yellow-300"
                }`}
                onClick={() => handleStarClick(star)}
                onMouseEnter={() => handleStarHover(star)}
                onMouseLeave={handleStarLeave}
              />
            ))}
          </div>
        </div>
      </div>
      {showTicketModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex justify-center items-center">
          <div className="rounded-lg w-[80%]   h-[90%]  max-w-7xl relative">
            <button
              onClick={toggleTicketModal}
              className="absolute top-2 right-6 text-white text-2xl"
            >
              &times;
            </button>
             <TicketPanel 
              initialShortDescription={initialTicketDescription || ""}
              initialLongDescription={initialTicketDescription || ""}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;