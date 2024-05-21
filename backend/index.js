const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/chatDemo', { useNewUrlParser: true, useUnifiedTopology: true });

io.on('connection', (socket) => {
  console.log('New client connected');
  socket.on('message', (message) => {
    io.emit('message', message);
  });
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(5000, () => {
  console.log('Server running on port 5000');
});
