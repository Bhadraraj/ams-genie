// src/hooks/useChatManager.js

import { useState, useEffect, useCallback } from "react";
import { useChat } from "../../context/ChatContext";

const useChatManager = () => {
  const {
    currentChat,
    sendMessage,
    setInitialTicketDescription,
    updateChatSequence,
    setChatId,
  } = useChat();

  const [isLoading, setIsLoading] = useState(false);
  const [nextChatSeq, setNextChatSeq] = useState(1);

  // KEY FIX: This useEffect now correctly resets the sequence only when a new chat ID is selected.
  // It ensures the sequence for a new chat starts at 1, but for an ongoing chat, it continues from the last known sequence + 1.
  useEffect(() => {
    if (currentChat?.id) {
      // If an existing chat is selected, start the sequence from its last known seq.
      // We use `currentChat.seq` which should be the highest seq number from the last message in that chat.
      setNextChatSeq(currentChat.seq + 1);
    } else {
      // For a brand new chat, the sequence always starts at 1.
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

      // Pass the correct chat ID and sequence for continuing the conversation
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

        // Update context and state with the response data
        if (rawData.chatId) {
          if (!currentChat?.id) {
            // First message in a new chat. Set the chat ID and start next sequence at 2.
            if (setChatId) {
              setChatId(rawData.chatId);
            }
          }
          
          // KEY FIX: Always update the sequence based on the latest server response
          if (updateChatSequence) {
            updateChatSequence(rawData.chatSeq);
          }
          setNextChatSeq(rawData.chatSeq + 1);
        }

        let solutionContent = rawData.html || "No solution provided.";
        
        // Handling HTML content parsing, URL replacement etc.
        // This logic remains the same, but it's now contained within the hook.
        // (You may want to extract this into a separate utility function if it's used elsewhere)
        
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
    ]
  );

  return { handleSendMessage, isLoading, nextChatSeq };
};

export default useChatManager;