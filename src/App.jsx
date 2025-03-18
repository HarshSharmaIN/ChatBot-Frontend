import { useState, useRef, useEffect } from 'react';
import ChatInterface from './components/ChatInterface';
import DoctorList from './components/DoctorList';
import { extractInfo } from './utils/helpers';
import handleChat from './utils/handleChat';
import axios from 'axios';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [userData, setUserData] = useState({ name: '', age: 0, gender: '', medicalHistory: '', symptoms: '' });
  const [currentStep, setCurrentStep] = useState('greeting');
  const [doctors, setDoctors] = useState([]);
  const [showDoctors, setShowDoctors] = useState(false);
  const chatContainerRef = useRef(null);
  const [showRecommendDoctorsButton, setShowRecommendDoctorsButton] = useState(false);
  const messageIdCounter = useRef(0);

  const addMessage = (text, sender, isLoading) => {
    isLoading = isLoading || false;
    setMessages((prev) => [
      ...prev,
      { id: (messageIdCounter.current++).toString(), text, sender, isLoading, timestamp: new Date() },
    ]);
  };

  useEffect(() => {
    if (currentStep === 'greeting') addMessage("Hello! I'm your medical assistant. What's your name?", 'bot');
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }, [messages, currentStep]);

  const nameRegex = /(?:my name is|i am|name is)\s+([a-zA-Z\s]+)|([a-zA-Z]+)/i;
  const ageRegex = /(?:my age is|i am)\s+(\d+)|\b(\d+)\b/i;
  const medicalHistoryRegex = /(?:my medical history is|history is)\s+([a-zA-Z\s,]+)|([a-zA-Z\s,]+)/i;
  const symptomRegex = /(?:i have symptoms like|symptoms like)\s+([a-zA-Z\s,]+)|([a-zA-Z\s,]+)/i;
  const genderRegex = /(?:my gender is|gender is)\s+([a-zA-Z\s]+)|([a-zA-Z]+)/i;

  const handleGreeting = (userMessage) => {
    const name = extractInfo(userMessage, nameRegex);
    if (name) {
      setUserData((prev) => ({ ...prev, name }));
      setCurrentStep('age');
      addMessage(`Nice to meet you, ${name}! What's your age?`, 'bot');
    } else addMessage("I couldn't understand your name. Please enter it again.", 'bot');
  };

  const handleAge = (userMessage) => {
    const age = parseInt(extractInfo(userMessage, ageRegex));
    if (age !== null && !isNaN(age) && age >= 0 && age <= 120) {
      setUserData((prev) => ({ ...prev, age: parseInt(age) }));
      setCurrentStep('gender');
      addMessage("What's your gender?", 'bot');
    } else addMessage('Please enter a valid age between 0 and 120.', 'bot');
  };

  const handleGender = (userMessage) => {
    const gender = extractInfo(userMessage, genderRegex);
    if (gender) {
      setUserData((prev) => ({ ...prev, gender: gender }));
      setCurrentStep('history');
      addMessage("Do you have any medical history you'd like to share? If not, just type \"none\".", 'bot');
    } else {
      setUserData((prev) => ({ ...prev, gender: userMessage }));
      setCurrentStep('history');
      addMessage("Do you have any medical history you'd like to share? If not, just type \"none\".", 'bot');
    }
  };

  const handleHistory = (userMessage) => {
    const history = extractInfo(userMessage, medicalHistoryRegex);
    if (history) {
      setUserData((prev) => ({ ...prev, medicalHistory: history }));
      setCurrentStep('symptoms');
      addMessage("What symptoms are you experiencing?", 'bot');
    } else {
      setUserData((prev) => ({ ...prev, medicalHistory: userMessage }));
      setCurrentStep('symptoms');
      addMessage("What symptoms are you experiencing?", 'bot');
    }
  };

  const handleSymptoms = (userMessage) => {
    const symptoms = extractInfo(userMessage, symptomRegex);
    if (symptoms) {
      setUserData((prev) => ({ ...prev, symptoms: symptoms }));
      setCurrentStep('chat');
      addMessage('Thank you for sharing. How can I help you today? You can ask about doctors or any medical concerns.', 'bot');
    } else {
      setUserData((prev) => ({ ...prev, symptoms: userMessage }));
      setCurrentStep('chat');
      addMessage('Thank you for sharing. How can I help you today? You can ask about doctors or any medical concerns.', 'bot');
    }
  };

  const handleChatWrapper = async (userMessage) => {
    addMessage('', 'bot', true); 
  
    try {
      const aiResponse = await handleChat(userMessage, userData);
      removeLoadingMessage(); 
      addMessage(aiResponse, 'bot');
      if (!showDoctors) setShowRecommendDoctorsButton(true);
    } catch (error) {
      console.error('Error in handleChatWrapper:', error);
      removeLoadingMessage();
      addMessage('Sorry, there was an error processing your request.', 'bot');
    }
  
  };
  
  const removeLoadingMessage = () => {
    setMessages((prevMessages) => prevMessages.filter((message) => !message.isLoading));
  };

  const handleShowRecommendedDoctors = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/doctors`, { symptoms: userData.symptoms });
      console.log(response.data);
      
      if (response.data.doctors.length == 0) {
        addMessage("Sorry! But we have no Doctors at Present.", "bot");
      } else {
        setDoctors(response.data.doctors);
        setShowDoctors(true);
        addMessage('Here are some recommended doctors:', 'bot');
        setShowRecommendDoctorsButton(false);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
      addMessage('Sorry, there was an error fetching doctor information.', 'bot');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMessage = input.trim();
    addMessage(userMessage, 'user');
    setInput('');

    switch (currentStep) {
      case 'greeting': handleGreeting(userMessage); break;
      case 'age': handleAge(userMessage); break;
      case 'gender': handleGender(userMessage); break;
      case 'history': handleHistory(userMessage); break;
      case 'symptoms': handleSymptoms(userMessage); break;
      case 'chat': handleChatWrapper(userMessage); break;
      default: break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto p-4">
        <ChatInterface
          messages={messages}
          input={input}
          setInput={setInput}
          handleSubmit={handleSubmit}
          chatContainerRef={chatContainerRef}
        />
        {showRecommendDoctorsButton && (
          <button
            onClick={handleShowRecommendedDoctors}
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Show Recommended Doctors
          </button>
        )}
        {showDoctors && <DoctorList doctors={doctors} />}
      </div>
    </div>
  );
}

export default App;