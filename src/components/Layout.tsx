import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./sidebar/Sidebar";
import ChatArea from "./chat/ChatArea";
import { Ticket } from "lucide-react";
import TicketPanel from "./ticket/TicketPanel";
import { useChat } from "../context/ChatContext";
import introImg from "../assets/logo-login.png";
const Layout: React.FC = () => {
 const { startNewChat, initialTicketDescription } = useChat(); 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [isTicketOpen, setIsTicketOpen] = useState(false); 
  const [showInputArea, setShowInputArea] = useState(true); 
  const [showTicketModal, setShowTicketModal] = useState(false);

  const toggleChat = () => {
    setShowInputArea(!showInputArea);
  };

  const openChat = () => {
    setIsChatOpen(true);
    setShowInputArea(true);
  };

  const handleNewChat = () => {
    startNewChat(); 
    setIsChatOpen(true);
    setShowInputArea(true);
  };

  const toggleTicketModal = () => {
    setShowTicketModal((prev) => !prev);
  };

  return (
    <>
      <div className="flex flex-col h-screen layoutOuter relative">
        <Header
          toggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          isMobileMenuOpen={isMobileMenuOpen}
        />
        <div className="flex flex-1">
          <div
            className={`${
              isMobileMenuOpen ? "block" : "hidden"
            } md:block md:w-60 lg:w-72 flex-shrink-0 bg-[#001f3f] text-white`}
          >
            <Sidebar onChatSelect={openChat} onNewChat={handleNewChat} />
          </div>
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            <div className="flex-1 overflow-y-auto bg-gray-50">
              <ChatArea
                showInputArea={showInputArea}
                onToggleInputArea={toggleChat}
              />
            </div>
          </div>
        </div>
        <button
          onClick={toggleTicketModal}
          className="fixed bottom-24 right-6 bg-green-600 hover:bg-green-700 text-white rounded-full p-3 shadow-lg transition-colors duration-200 z-50"
          aria-label="Create Ticket"
        >
          <Ticket className="w-6 h-6" />
        </button>

        <button
          onClick={toggleChat}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition-colors duration-200 z-50"
          aria-label="Toggle Chat Input"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </button>
      </div>
      {showTicketModal && (
        <div className="fixed p-8 inset-0 bg-black bg-opacity-80 z-50 flex justify-center items-center">
          <div className="rounded-lg w-[80%] h-[90%] max-w-7xl relative">
            <button
              onClick={toggleTicketModal}
              className="absolute top-2 right-6 text-white text-2xl"
              aria-label="Close modal"
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
    </>
  );
};

export default Layout;