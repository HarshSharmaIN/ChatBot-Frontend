import { Send, Stethoscope } from 'lucide-react';
import { ChatMessage } from './ChatMessage';

function ChatInterface({ messages, input, setInput, handleSubmit, chatContainerRef }) {
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-100">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
        <div className="flex items-center gap-3">
          <Stethoscope className="w-8 h-8 text-white" />
          <h1 className="text-white text-2xl font-semibold">Medical Assistant</h1>
        </div>
      </div>
      <div
        ref={chatContainerRef}
        className="h-[400px] sm:h-[500px] overflow-y-auto p-6 space-y-4"
      >
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
      </div>
      <form onSubmit={handleSubmit} className="border-t p-4 bg-gray-50">
        <div className="flex flex-col sm:flex-row gap-3"> {/* Use flex-col on small screens, flex-row on larger */}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl px-6 py-3 hover:opacity-90 transition-opacity duration-200 flex items-center gap-2 w-full sm:w-auto" // w-full on small, w-auto on larger
          >
            <Send className="w-5 h-5" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChatInterface;
