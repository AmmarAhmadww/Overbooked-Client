import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X } from 'lucide-react';
import PropTypes from 'prop-types';

const LibraryChat = ({ books, onClose }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I'm your Library Assistant. I can help you find books, provide summaries, and answer questions about our library collection. What would you like to know?"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/library/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          books: books
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.response 
      }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm sorry, I encountered an error. Please try again."
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg flex flex-col
      w-[95vw] h-[40vh] 
      sm:w-[400px] sm:h-[500px] 
      md:w-[450px] md:h-[500px]
      lg:w-[350px] lg:h-[425px]
      shadow-[0_0_20px_rgba(0,0,0,0.15)] 
      dark:shadow-[0_0_20px_rgba(0,0,0,0.3)]
      hover:shadow-[0_0_25px_rgba(0,0,0,0.2)]
      transition-shadow duration-300"
    >
      {/* Header */}
      <div className="p-2 sm:p-3 bg-blue-600 text-white rounded-t-lg flex justify-between items-center">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5" />
          <h3 className="font-semibold text-sm sm:text-base">Library Assistant</h3>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200 transition-colors"
        >
          <X className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-2 sm:p-3 space-y-2 sm:space-y-3">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-lg p-2 text-sm ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-2">
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-100" />
                <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-2 sm:p-3 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything..."
            className="flex-1 p-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 flex-shrink-0"
          >
            <Send className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

LibraryChat.propTypes = {
  books: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      bookName: PropTypes.string.isRequired,
      author: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
      rating: PropTypes.number.isRequired,
      available: PropTypes.number.isRequired,
    })
  ).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default LibraryChat; 