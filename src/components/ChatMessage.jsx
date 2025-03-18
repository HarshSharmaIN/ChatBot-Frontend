import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Bot, User } from 'lucide-react';
import Loader from './Loader';

export const ChatMessage = ({ message }) => {
  const isBot = message.sender === 'bot';

  if (message.isLoading) {
    return (
      <div className={`flex justify-start mb-4`}>
        <div className={`flex items-start gap-3 flex-row`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100`}>
            <Bot className="w-6 h-6 text-blue-600" />
          </div>
          <div className={`max-w-md px-6 py-3 rounded-2xl bg-white border border-blue-100 text-gray-800 shadow-sm`}>
            <Loader/>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4`}>
      <div
        className={`flex items-start gap-3 ${
          isBot ? 'flex-row' : 'flex-row-reverse'
        }`}
      >
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isBot
              ? 'bg-gradient-to-br from-blue-100 to-indigo-100'
              : 'bg-gradient-to-br from-green-100 to-emerald-100'
          }`}
        >
          {isBot ? (
            <Bot className="w-6 h-6 text-blue-600" />
          ) : (
            <User className="w-6 h-6 text-green-600" />
          )}
        </div>
        <div
          className={`max-w-md px-6 py-3 rounded-2xl ${
            isBot
              ? 'bg-white border border-blue-100 text-gray-800 shadow-sm'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
          }`}
        >
          <div className="markdown-content">
            <ReactMarkdown
              children={message.text}
              remarkPlugins={[remarkGfm]}
            />
          </div>
          <span className="text-xs opacity-70 mt-2 block">
            {message.timestamp.toLocaleTimeString()}
          </span>
        </div>
      </div>
    </div>
  );
};