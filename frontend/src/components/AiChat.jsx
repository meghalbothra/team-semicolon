import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Mic, MicOff } from 'lucide-react';
import axios from 'axios';
import ChatbotImage from '../Assets/pngtree-chatbot-ai-robot-assistant-for-user-correspondence-ai-customer-presentation-vector-png-image_12712119.png';
import { FaRobot } from 'react-icons/fa';

const MentalHealthChatUI = () => {
  const [messages, setMessages] = useState([
    { id: 1, type: 'text', text: "Hello! How can I assist you today?", sender: 'bot' },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [chatStarted, setChatStarted] = useState(false);
  const [isBotTyping, setIsBotTyping] = useState(false);

  // Speech recognition states
  const [isRecording, setIsRecording] = useState(false);
  const [micPermission, setMicPermission] = useState(null); // 'granted', 'denied', or 'prompt'

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // Check microphone permission using the Permissions API
  useEffect(() => {
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'microphone' }).then(permissionStatus => {
        setMicPermission(permissionStatus.state);
        permissionStatus.onchange = () => {
          setMicPermission(permissionStatus.state);
        };
      });
    }
  }, []);

  const handleSendMessage = async () => {
    if (inputMessage.trim() !== '') {
      // Add the typed message to the chat as a user message
      setMessages(prev => [...prev, { id: prev.length + 1, type: 'text', text: inputMessage, sender: 'user' }]);
      const userMsg = inputMessage;
      setInputMessage('');
      setIsBotTyping(true);

      try {
        const response = await axios.post('http://localhost:8000/chat', {
          message: userMsg,
        });

        // Add bot reply message
        setMessages(prev => [
          ...prev, 
          { id: prev.length + 1, type: 'text', text: response.data.reply, sender: 'bot' }
        ]);
        
        // If crisis alert is positive, add an alert message with yellow styling
        if (response.data.crisis_alert === "High distress detected. Please seek help immediately.") {
          setMessages(prev => [
            ...prev, 
            { id: prev.length + 1, type: 'alert', text: "Crisis Alert: High distress detected. Please seek help immediately.", sender: 'bot' }
          ]);
        }
        
        setIsBotTyping(false);
      } catch (error) {
        console.error("Error sending message to backend:", error);
        setMessages(prev => [
          ...prev, 
          { id: prev.length + 1, type: 'text', text: "Sorry, there was an issue. Please try again later.", sender: 'bot' }
        ]);
        setIsBotTyping(false);
      }
    }
  };

  const handleStartChat = () => {
    setChatStarted(true);
  };

  // Use the browser's Speech Recognition API (STT) to transcribe speech to text
  const startRecording = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support speech recognition.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onresult = (event) => {
      setIsRecording(false);
      const transcript = event.results[0][0].transcript;
      // Add transcribed text as a voice message (styled differently)
      setMessages(prev => [...prev, { id: prev.length + 1, type: 'voice', text: transcript, sender: 'user' }]);
      // Send the transcribed text to the backend (as text)
      sendVoiceMessage(transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsRecording(false);
    };

    recognition.start();
  };

  // Stop recording (not strictly needed as SpeechRecognition stops automatically)
  const stopRecording = () => {
    setIsRecording(false);
  };

  // Send the transcribed voice message to the backend as text
  const sendVoiceMessage = async (transcript) => {
    setIsBotTyping(true);
    try {
      const response = await axios.post('http://localhost:8000/chat', {
        message: transcript,
      });
      
      // Add bot reply message
      setMessages(prev => [
        ...prev, 
        { id: prev.length + 1, type: 'text', text: response.data.reply, sender: 'bot' }
      ]);
      
      // Add alert message if crisis alert is positive
      if (response.data.crisis_alert === "High distress detected. Please seek help immediately.") {
        setMessages(prev => [
          ...prev, 
          { id: prev.length + 1, type: 'alert', text: "Crisis Alert: High distress detected. Please seek help immediately.", sender: 'bot' }
        ]);
      }
      
      setIsBotTyping(false);
    } catch (error) {
      console.error("Error sending voice message to backend:", error);
      setMessages(prev => [
        ...prev, 
        { id: prev.length + 1, type: 'text', text: "Sorry, there was an issue processing your message.", sender: 'bot' }
      ]);
      setIsBotTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-r from-purple-100 to-purple-300 sm:p-8">
      {!chatStarted ? (
        <div className="flex flex-col items-center justify-center w-full h-full space-y-6 bg-white p-8 shadow-lg rounded-lg animate-fadeIn">
          <h1 className="text-4xl font-semibold text-purple-600 animate-bounce text-center">
            Welcome to AI Chat Buddy
          </h1>
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
                        className={`rounded-2xl px-3 py-2 shadow-md leading-snug break-words text-sm sm:text-base ${
                          message.sender === 'user'
                            ? message.type === 'voice'
                              ? 'bg-blue-600 text-white rounded-tr-none'
                              : 'bg-purple-600 text-white rounded-tr-none'
                            : message.type === 'alert'
                              ? 'bg-yellow-300 text-black'
                              : 'bg-white border-2 border-purple-100 rounded-tl-none'
                        }`}
                      >
                        {message.type === 'voice' ? (
                          <div className="flex items-center">
                            <Mic className="h-5 w-5 mr-2" />
                            <span>{message.text}</span>
                          </div>
                        ) : (
                          message.text
                        )}
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
                <div className="flex items-center space-x-2">
                  <div className="bg-purple-50 rounded-lg p-1.5 flex items-center space-x-2 shadow-inner flex-grow">
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
                  <div>
                    {isRecording ? (
                      <button
                        onClick={stopRecording}
                        className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center shadow-md"
                      >
                        <MicOff className="h-5 w-5" />
                      </button>
                    ) : (
                      <button
                        onClick={startRecording}
                        className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center shadow-md"
                      >
                        <Mic className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
                {micPermission && (
                  <p className="text-xs text-center text-gray-500 mt-2">
                    Microphone permission: {micPermission}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentalHealthChatUI;
