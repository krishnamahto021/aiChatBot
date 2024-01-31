import React, { useState, useEffect } from "react";

const App = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const query = async (data) => {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/satvikag/chatbot",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_AI_CHAT_BOT_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    const result = await response.json();
    return result;
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim() === "") return;

    setMessages((prevMessages) => [
      ...prevMessages,
      { text: inputMessage, isUser: true },
    ]);

    setIsTyping(true);
    setTimeout(async () => {
      setIsTyping(false);

      const response = await query({
        inputs: {
          text: inputMessage,
        },
      });
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: response.generated_text, isUser: false },
      ]);
    }, 1000);

    setInputMessage("");
  };

  return (
    <div className="font-sans bg-[#7d8597] h-screen flex flex-col">
      <div className="flex-1 overflow-hidden bg-gradient-to-tr from-[#5c677d] to-[#7d8597] p-4">
        <div className="overflow-y-auto  h-full flex flex-col">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 p-3 rounded max-w-[50%] w-fit 
 ${message.isUser ? "bg-[#ffe5ec] text-black " : "bg-[#fff0f3] ml-auto "}`}
            >
              {message.text}
            </div>
          ))}
          {isTyping && (
            <div className="p-3 rounded bg-gray-300 self-start max-w-[50%] w-fit">
              <div className="animate-typing ml-auto">Typing...</div>
            </div>
          )}
        </div>
      </div>

      {/* Input and Send Button */}
      <div className="bg-gray-700 p-4 flex items-center">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          className="w-full px-4 py-2 border rounded-md mr-2 focus:outline-none "
          placeholder="Type a message..."
        />
        <button
          onClick={handleSendMessage}
          className="bg-[#c9184a] text-white px-4 py-2 rounded-md focus:outline-none hover:bg-[]"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default App;
