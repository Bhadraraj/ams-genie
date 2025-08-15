import React, { useEffect, useRef } from "react";
import Message from "./Message";
import { useChat } from "../../context/ChatContext";

const MessageList: React.FC = () => {
  const { messages } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="space-y-4 mb-6 cardMain">
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
