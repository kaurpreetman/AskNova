const setupSocketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('generate-response', (data) => {
      // Handle incoming prompt and emit fake stream
      socket.emit('generate-response-chunk', { chunk: 'Hello from AI...' });
      socket.emit('generate-response-result', { complete: true });
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
};

export default setupSocketHandler;
