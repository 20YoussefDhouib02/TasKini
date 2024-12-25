import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { type: "bot", text: "Hi! How can I assist you today?" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatAreaRef = useRef(null); // For dynamic height and scrolling
  const chatEndRef = useRef(null); // For auto-scroll

  const handleSend = async () => {
    if (input.trim()) {
      // Add user message to the chat
      setMessages((prev) => [...prev, { type: "user", text: input }]);
      setInput(""); // Clear input field
      setIsTyping(true); // Show typing indicator

      try {
        // Send request to the chatbot API with prompt
        const response = await axios.post(`${import.meta.env.VITE_APP_BASE_URL}/api/task/prompt-post`, {
          prompt: input, // Pass the input as prompt
        });

        // Add bot response to chat
        setMessages((prev) => [
          ...prev,
          { type: "bot", text: response.data || "No response from bot." },
        ]);
      } catch (error) {
        console.error("Error fetching bot response:", error);
        setMessages((prev) => [
          ...prev,
          { type: "bot", text: "Sorry, something went wrong. Please try again." },
        ]);
      } finally {
        setIsTyping(false); // Hide typing indicator
      }
    }
  };

  useEffect(() => {
    // Scroll to the latest message
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 text-xl font-bold shadow-lg">
        Chatbot Assistant
      </div>

      {/* Chat Area */}
      <div
        ref={chatAreaRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar"
        style={{
          maxHeight: "calc(100vh - 160px)", // Maximum height for the chat area
          overflowY: messages.length > 5 ? "scroll" : "hidden", // Scroll only when needed
          scrollbarWidth: "thin",
          scrollbarColor: "#cbd5e1 #f1f5f9",
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.type === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`${
                msg.type === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 text-gray-800"
              } p-3 rounded-lg shadow-md max-w-xs text-base`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-300 text-gray-800 p-3 rounded-lg shadow-md max-w-xs">
              Typing...
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="flex items-center p-4 bg-white border-t shadow-lg">
        <input
          type="text"
          className="flex-1 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          className="ml-4 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition duration-200 text-base"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
