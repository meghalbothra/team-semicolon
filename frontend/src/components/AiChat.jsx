import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot } from 'lucide-react';
import axios from 'axios';
import ChatbotImage from '../Assets/pngtree-chatbot-ai-robot-assistant-for-user-correspondence-ai-customer-presentation-vector-png-image_12712119.png';
import { FaRobot } from 'react-icons/fa';

const MentalHealthChatUI = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! How can I assist you today?", sender: 'bot' },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [chatStarted, setChatStarted] = useState(false);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async () => {
    if (inputMessage.trim() !== '') {
      setMessages([...messages, { id: messages.length + 1, text: inputMessage, sender: 'user' }]);
      setInputMessage('');
      setIsBotTyping(true);

      try {
        const response = await axios.post('http://localhost:8000/chat', {
          user_id: 'some_user_id',
          message: inputMessage,
        });

        setTimeout(() => {
          setMessages((prev) => [...prev, { id: prev.length + 1, text: response.data.reply, sender: 'bot' }]);
          setIsBotTyping(false);
        }, 1000);
      } catch (error) {
        console.error("Error sending message to backend:", error);
        setMessages((prev) => [...prev, { id: prev.length + 1, text: "Sorry, there was an issue. Please try again later.", sender: 'bot' }]);
        setIsBotTyping(false);
      }
    }
  };

  const handleStartChat = () => {
    setChatStarted(true);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-r from-purple-100 to-purple-300 sm:p-8">
      {!chatStarted ? (
        <div className="flex flex-col items-center justify-center w-full h-full space-y-6 bg-white p-8 shadow-lg rounded-lg animate-fadeIn">
          <h1 className="text-4xl font-semibold text-purple-600 animate-bounce text-center">Welcome to AI Chat Buddy</h1>
          <p className="text-gray-600 text-center max-w-md">
            Get support and assistance by chatting with our AI. Click below to start your conversation.
          </p>
          <img src={ChatbotImage} alt="Chatbot" className="w-1/3 h-auto object-cover mb-4" />
          <button
            onClick={handleStartChat}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-transform duration-200 transform hover:scale-105 shadow-lg text-lg"
          >
            Start Chat
          </button>
        </div>
      ) : (
        <div className="w-full h-full sm:max-w-2xl sm:h-[90vh] mx-auto flex flex-col bg-white sm:rounded-2xl overflow-hidden sm:border-4 border-white shadow-2xl">
          <div className="bg-purple-600 text-white p-4 text-xl font-semibold text-center flex items-center justify-center">
            <FaRobot className="h-8 w-8 mr-2" />
            AI Chat Buddy
          </div>

          <div className="flex-grow bg-gradient-to-b from-purple-50 to-white overflow-hidden">
            <div className="h-full flex flex-col">
              <div className="flex-grow overflow-y-auto p-4 space-y-3 scrollbar-hide">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
                    <div className={`flex items-start max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`flex-shrink-0 ${message.sender === 'user' ? 'ml-2' : 'mr-2'}`}>
                        {message.sender === 'user' ? (
                          <div className="bg-purple-100 p-1.5 rounded-full shadow-md">
                            <User className="h-5 w-5 text-purple-600" />
                          </div>
                        ) : (
                          <div className="bg-purple-200 p-1.5 rounded-full shadow-md">
                            <Bot className="h-5 w-5 text-purple-700" />
                          </div>
                        )}
                      </div>
                      <div 
                        className={`rounded-2xl px-3 py-2 shadow-md leading-snug ${
                          message.sender === 'user' 
                            ? 'bg-purple-600 text-white rounded-tr-none' 
                            : 'bg-white border-2 border-purple-100 rounded-tl-none'
                        } break-words text-sm sm:text-base`}
                      >
                        {message.text}
                      </div>
                    </div>
                  </div>
                ))}
                {isBotTyping && (
                  <div className="flex justify-start animate-fadeIn">
                    <div className="flex items-start">
                      <div className="bg-purple-200 p-1.5 rounded-full shadow-md mr-2">
                        <Bot className="h-5 w-5 text-purple-700" />
                      </div>
                      <div className="bg-white border-2 border-purple-100 rounded-2xl rounded-tl-none p-2 shadow-md">
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 rounded-full animate-bounce bg-purple-300"></div>
                          <div className="w-2 h-2 rounded-full animate-bounce bg-purple-400 delay-200"></div>
                          <div className="w-2 h-2 rounded-full animate-bounce bg-purple-500 delay-300"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-3 bg-white border-t border-purple-100">
                <div className="bg-purple-50 rounded-lg p-1.5 flex items-center space-x-2 shadow-inner">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-grow p-2 bg-transparent border-none focus:outline-none focus:ring-0 placeholder-purple-400 text-sm sm:text-base"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center shadow-md"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentalHealthChatUI;