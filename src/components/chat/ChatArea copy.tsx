import React, { useEffect, useRef, useState, useCallback } from "react";
import MessageInput from "./MessageInput";
import ResolutionSection from "./ResolutionSection";
import { useChat } from "../../context/ChatContext";
import TicketPanel from "../ticket/TicketPanel";
import img from "../../assets/resolution.jpg";

interface ChatAreaProps {
  showInputArea?: boolean;
  onToggleInputArea?: () => void;
}

const ChatArea = ({
  showInputArea = true,
  onToggleInputArea,
}) => {
  const {
    currentChat,
    sendMessage,
    messages,
    initialTicketDescription,
    setInitialTicketDescription,
    updateChatSequence,
    setChatId,
    refetchChatHistory, // New import
  } = useChat();

  const messagesContainerRef = useRef(null);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [nextChatSeq, setNextChatSeq] = useState(1);

  const activeColor = {
    bg: "bg-green-500",
    border: "border-green-200",
  };

  const handleClick = () => {
    setIsActive(!isActive);
  };

  useEffect(() => {
    if (currentChat?.id) {
      setNextChatSeq((currentChat.seq || 0) + 1);
    } else {
      setNextChatSeq(1);
    }
  }, [currentChat]);

  const handleSendMessage = useCallback(
    async (message, questionId) => {
      sendMessage(message, "user");
      setInitialTicketDescription(message);
      setIsLoading(true);

      const requestBody = {
        error_description: message,
        userId: "babu.s@sirc.sa",
      };

      if (questionId) {
        requestBody.questionId = questionId;
      }

      if (currentChat?.id) {
        requestBody.chat_id = currentChat.id;
        requestBody.chatSeq = nextChatSeq;
      }

      try {
        const response = await fetch(
          "https://api-config.amsgenius.com/api/errors/getsolution",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const rawData = await response.json();

        if (rawData.chatId) {
          if (!currentChat?.id) {
            if (setChatId) {
              setChatId(rawData.chatId);
            }
          }
          
          if (updateChatSequence) {
            updateChatSequence(rawData.chatSeq);
          }
          setNextChatSeq(rawData.chatSeq + 1);
        }

        let solutionContent = rawData.html || "No solution provided.";

        const apiBaseUrl = "https://api-config.amsgenius.com";
        solutionContent = solutionContent.replace(
          /src="\/api\/images\//g,
          `src="${apiBaseUrl}/api/images/`
        );

        if (solutionContent && solutionContent.trim()) {
          sendMessage(solutionContent, "system");
        } else {
          sendMessage("No solution was provided in the response.", "system");
        }
        
        // Crucial change: Call refetchChatHistory to update the history list
        refetchChatHistory();

      } catch (error) {
        console.error("Fetch error:", error);
        sendMessage(
          `A network error occurred: ${error.message}. Please try again.`,
          "system"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [
      currentChat,
      nextChatSeq,
      sendMessage,
      setInitialTicketDescription,
      updateChatSequence,
      setChatId,
      refetchChatHistory,
    ]
  );

  const toggleTicketModal = () => {
    setShowTicketModal((prev) => !prev);
  };

  useEffect(() => {
    if (currentChat) {
      const firstUserMessage = messages.find(msg => msg.sender === 'user');
      if (firstUserMessage) {
        setInitialTicketDescription(firstUserMessage.content);
      } else {
        setInitialTicketDescription(currentChat.title || "");
      }
    } else {
      setInitialTicketDescription("");
    }
  }, [currentChat, messages, setInitialTicketDescription]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const isExistingMockChat =
    currentChat && typeof currentChat.id === 'string' && currentChat.id.includes('mock');

  const LoaderComponent = () => (
    <div className="flex justify-start mb-4">
      <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg rounded-bl-sm max-w-[70%] shadow-sm border border-white/20">
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
        <div className="text-white/80 text-sm font-medium">
          AMS Genie is thinking...
        </div>
      </div>
    </div>
  );

  const renderInterleavedMessages = () => {
    return (
      <>
        {messages.map((msg, index) => {
          if (msg.sender === 'user') {
            return (
              <div key={`user-${index}`} className="flex justify-end mb-4">
                <div className="bg-blue-600 text-white p-3 rounded-lg rounded-br-sm max-w-[70%] shadow-sm">
                  <p className="m-0 text-sm leading-relaxed">
                    {msg.content}
                  </p>
                </div>
              </div>
            );
          }
          if (msg.sender === 'system') {
            let cleanedContent = msg.content
              .replace(/###ANSWER_START###|###ANSWER_END###/g, '')
              .replace(/####SIRC_HELP_\d+_\d+/g, '')
              .trim();
            return (
              <ResolutionSection
                key={`system-${index}`}
                htmlContent={cleanedContent}
                title="AMS Genie"
                steps={[]}
                question=""
              />
            );
          }
          return null;
        })}
        {isLoading && <LoaderComponent />}
      </>
    );
  };

  return (
    <div className="h-full flex flex-col cardMain overflow-hidden">
      <div className="p-4 flex-shrink-0 text-white">
        <h2 className="text-xl">
          {currentChat ? currentChat.title : "Chat Assistant"}
        </h2>
        {currentChat?.id && (
          <div className="text-sm text-gray-400 mt-1">
            Chat ID: {currentChat.id} | Next Sequence: {nextChatSeq}
          </div>
        )}
      </div>
      <div className="flex-1 flex flex-col min-h-0 px-4">
        <div
          ref={messagesContainerRef}
          className="overflow-y-auto pr-2 space-y-4 py-4 custom-scrollbar max-h-[60vh]"
        >
          {renderInterleavedMessages()}
        </div>
      </div>
      {showInputArea && (
        <div className="p-4 flex-shrink-0 mb-5 bg-transparent">
          <MessageInput
            onSendMessage={handleSendMessage}
            placeholder="Ask your question..."
            disabled={isLoading}
          />
          <div className="flex justify-center">
            <div className="max-w-[80%] flex flex-col sm:flex-row mt-4 gap-2">
              <button
                onClick={toggleTicketModal}
                disabled={isLoading}
                className={`flex-1 py-2 text-nowrap px-4 card-border font-medium text-white rounded transition-colors ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                I want to create a ticket
              </button>
              <button
                onClick={handleClick}
                disabled={isLoading}
                className={`flex-1 text-nowrap py-2 px-4 card-border border text-white border-gray-300 font-medium rounded transition-all duration-200 max-w-md
                  ${
                    isActive
                      ? `${activeColor.bg} ${activeColor.border} shadow-lg ring-2 `
                      : " "
                  }
                  ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                I want in line with resolution
              </button>
            </div>
          </div>
        </div>
      )}
      {showTicketModal && (
        <div className="fixed p-8 inset-0 bg-black bg-opacity-80 z-50 flex justify-center items-center">
          <div className="rounded-lg w-[80%] h-[90%] max-w-7xl relative">
            <button
              onClick={toggleTicketModal}
              className="absolute top-2 right-6 text-white text-2xl z-10"
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
    </div>
  );
};

export default ChatArea;