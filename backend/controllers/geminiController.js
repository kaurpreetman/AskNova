import GeminiSocketHandler from '../service/socket.js';

let socketHandler;

const initSocketHandler = (server) => {
  socketHandler = new GeminiSocketHandler(server);
  return socketHandler;
};



const genResponse = async (req, res) => {
  try {
    if (!socketHandler) {
      return res.status(500).json({ success: false, message: 'Socket handler not initialized' });
    }

    const { userPrompt, trainingData, userId } = req.body;

    if (!userPrompt || !userId) {
      return res.status(400).json({ success: false, message: 'Prompt and userID are required' });
    }

    socketHandler.getIO().once('error', (error) => {
      return res.status(500).json({ success: false, message: `Response generation failed: ${error.message}` });
    });

    socketHandler.getIO().once('generate-response-result', (data) => {
      if (!data || !data.response) {
        return res.status(500).json({ success: false, message: 'Invalid response format from Gemini' });
      }

      const response = {
        sessionId: data.sessionId,
        response: data.response,
        datasets: data.datasets || [],
        isComplete: data.isComplete !== false,
      };

      res.status(200).json({ success: true, data: response, message: 'Response generated successfully' });
    });

    socketHandler.getIO().emit('generate-response', {
      userPrompt,
      trainingData,
      userId,
      sessionId: req.body.sessionId || Date.now().toString(),
    });

  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


export {
  initSocketHandler,
  
  genResponse,
  
};