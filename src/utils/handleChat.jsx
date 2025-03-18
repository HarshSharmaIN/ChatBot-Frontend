import axios from 'axios';

const handleChat = async (userMessage, userData) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/chat`, {
      message: userMessage,
      userData: userData,
    });
    return response.data;

  } catch (error) {
    console.error('Error processing chat query:', error);
    return 'Sorry, there was an error processing your query.';
  }
};

export default handleChat;