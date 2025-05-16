import axios from "axios";
import React, { useRef, useState } from "react";
import { useEffect } from "react";
const Chat = () => {
  const hasRun = useRef(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");

  const sendMessage =  (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Simulate bot response
    setTimeout(async() => {
      const botReply = {
        sender: "bot",
        text: `You said: "${input}". This is a mock response.`,
      };
      setMessages((prev) => [...prev, botReply]);
      
      
      try {
        axios.defaults.withCredentials = false;
        const values = {
          message: input,
          userName: "mohit",
          botReply:botReply.text
        };
        const response = await axios.post("http://localhost:3000/chat", values);
        // const botReply = {
        //     sender: 'bot',
        //     text: response.data.reply || 'No response'
        // };
        // setMessages(prev => [...prev, botReply]);
        console.log(response.data.message);
      } catch (err) {
        console.error("Error sending message:", err);
        const errorReply = {
          sender: "Bot",
          text: "Oops! Something went wrong.",
        };
        setMessages((prev) => [...prev, errorReply]);
      }
    }, 800);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  useEffect(()=>{
    if (!hasRun.current) {

      hasRun.current = true;
      
      const fetchChatMessages = async()=>{
  
        try{
          const chatMessages = await axios.get("http://localhost:3000/chatMessages");
          console.log(chatMessages.data);
        }catch(error){
          console.log("No data",error)
        }
      }
      fetchChatMessages();
    }
  },[])

  return (
    <div className="max-w-md mx-auto mt-10 border shadow-lg rounded-lg overflow-hidden flex flex-col h-[500px]">
      <div className="p-4 bg-blue-600 text-white font-bold text-center">
        Chat with Bot
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-100">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-4 py-2 rounded-lg max-w-[70%] text-sm ${
                msg.sender === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-black border"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <div className="flex border-t p-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 border rounded px-3 py-2 mr-2"
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
