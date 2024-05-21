const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000', // Allow only this origin to access the server
  methods: ["GET", "POST"],
  credentials: true
}));

let users = [];

io.on('connection', (socket) => {
  console.log('New client connected');
  socket.on('message', (message) => {
    socket.broadcast.emit('message', message);
  });
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
  socket.on('new-user', (user) => {
    users.push(user);
    console.log("Users List: ", users);
    socket.broadcast.emit('new-user', users)
  });
  socket.on('remove-user', (user) => {
    const newUser = users.filter(userName=>userName!=user);
    users = newUser;
    console.log("Users List: ", users);
    socket.broadcast.emit('remove-user', user)
  });
});

server.listen(5000, () => {
  console.log(`Server running on http://localhost:5000`);
});

app.get('/users', (req, res)=>{
  res.json(users);
})
