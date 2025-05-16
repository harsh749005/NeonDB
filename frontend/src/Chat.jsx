import axios from "axios";
import { useRef, useState } from "react";
import { useEffect } from "react";
const Chat = () => {
  const hasRun = useRef(false);
  const userName = "mohit"; // this name will be fetch from user form
  const [messages, setMessages] = useState([]); //new chat and chat history are stored here
  const [input, setInput] = useState(""); //only new chat
  const messageEndRef = useRef(null); //to scroll up

  // function to send data to backend
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      // Save user message to backend
      await axios.post("http://localhost:3000/chat", {
        message: input,
        userName,
        sender: "user",
        timestamp: Date.now(),
      });

      // Simulate bot response
      setTimeout(async () => {
        const botText = `You said: "${input}". This is a mock response.`;
        const botReply = {
          sender: "bot",
          text: botText,
        };
        setMessages((prev) => [...prev, botReply]);
        // Save bot response to backend
        await axios.post("http://localhost:3000/chat", {
          message: botText,
          userName,
          sender: "bot",
          timestamp: Date.now(),
        });
      }, 800);
    } catch (error) {
      console.log("Error sending messages", error);
      const errorReply = {
        sender: "bot",
        text: "Oops! Something went wrong.",
      };
      setMessages((prev) => [...prev, errorReply]);
    }
  };

  // press enter to send messages
  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage(e);
  };
  // Fetching chats
  useEffect(() => {
    if (!hasRun.current) {
      hasRun.current = true;

      const fetchChatMessages = async () => {
        try {
          const chatMessages = await axios.get(
            "http://localhost:3000/chatMessages"
          );
          // setUserChats()
          let history = chatMessages.data.chats;
          const formatted = history.map((msg) => ({
            sender: msg.sender,
            text: msg.message,
          }));
          console.log("Fetched from API:", formatted);
          setMessages(formatted);
        } catch (error) {
          console.log("No data", error);
        }
      };
      fetchChatMessages();
    }
  }, []);

  // useEffect to scroll when new message
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
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
              msg.sender == "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-4 py-2 rounded-lg max-w-[70%] text-sm ${
                msg.sender == "user"
                  ? "bg-blue-500 text-white"
                  : "bg-black border"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messageEndRef} /> {/* dummy div added to scroll up */}
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
