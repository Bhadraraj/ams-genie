import React from "react";
import { Message as MessageType } from "../../types";

interface MessageProps {
  message: MessageType;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.sender === "user";

  return (
    <div
      className={`flex ${isUser ? "justify-end  " : "justify-start"}`}
    >
      <div
        className={`px-4 py-3 rounded-lg ${
          isUser
             ? "bg-[#002B50]   text-white text-dark rounded-tr-none"
            :  "bg-[#002B50]   text-white text-dark rounded-tr-none"
        }`}
      >
        <p>{message.content}</p>
      </div>
    </div>
  );
};

export default Message;
