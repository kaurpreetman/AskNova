// socketController.js

import GeminiSocketHandler from '../service/socket.js';

// Global socket handler
let socketHandler;

// Initialize socket handler
const initSocketHandler = (server) => {
  socketHandler = new GeminiSocketHandler(server);
  return socketHandler;
};

// Extract keywords and trigger Kaggle API logic
const extractKeywordsAndKaggleApiHit = async (req, res) => {
  try {
    if (!socketHandler) {
      return res.status(500).json({ success: false, message: 'Socket handler not initialized' });
    }

    const { userPrompt, userId } = req.body;

    if (!userPrompt || !userId) {
      return res.status(400).json({ success: false, message: 'Prompt and userID are required' });
    }

    // Emit event
    socketHandler.getIO().emit('extract-keywords', { userPrompt, userId });

    // Listen for result
    socketHandler.getIO().once('keywords-result', (data) => {
      res.status(200).json({ success: true, data, message: 'Suggested datasets successfully' });
    });

    // Listen for error
    socketHandler.getIO().once('error', (error) => {
      res.status(500).json({ success: false, message: `Keyword extraction failed: ${error.message}` });
    });

  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Generate response
const genResponse = async (req, res) => {
  try {
    if (!socketHandler) {
      return res.status(500).json({ success: false, message: 'Socket handler not initialized' });
    }

    const { userPrompt, trainingData, userId } = req.body;

    if (!userPrompt || !userId) {
      return res.status(400).json({ success: false, message: 'Prompt and userID are required' });
    }

    // Error listener
    socketHandler.getIO().once('error', (error) => {
      return res.status(500).json({ success: false, message: `Response generation failed: ${error.message}` });
    });

    // Response listener
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

    // Emit event
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

// Get user history
const getHistory = async (req, res) => {
  try {
    if (!socketHandler) {
      return res.status(500).json({ success: false, message: 'Socket handler not initialized' });
    }

    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    // Listen for result
    socketHandler.getIO().once('history-result', (data) => {
      res.status(200).json({ success: true, data, message: 'History retrieved successfully' });
    });

    // Listen for error
    socketHandler.getIO().once('error', (error) => {
      res.status(500).json({ success: false, message: `History retrieval failed: ${error.message}` });
    });

    // Emit event
    socketHandler.getIO().emit('get-history', { userId });

  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export {
  initSocketHandler,
  extractKeywordsAndKaggleApiHit,
  genResponse,
  getHistory,
};
