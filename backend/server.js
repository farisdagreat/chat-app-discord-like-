import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

const users = new Map();
const rooms = new Map();

// Store active voice connections
const voiceConnections = new Map();

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('user_join', (data) => {
    const { username, roomId } = data;
    users.set(socket.id, { username, roomId, socketId: socket.id });
    
    if (!rooms.has(roomId)) {
      rooms.set(roomId, []);
    }
    rooms.get(roomId).push(socket.id);
    
    socket.join(roomId);
    
    // Notify room of new user
    io.to(roomId).emit('user_joined', {
      username,
      userId: socket.id,
      usersInRoom: rooms.get(roomId).length
    });
  });

  socket.on('send_message', (data) => {
    const user = users.get(socket.id);
    if (user) {
      io.to(user.roomId).emit('receive_message', {
        username: user.username,
        content: data.content,
        timestamp: new Date(),
        userId: socket.id,
        avatar: data.avatar || '👤'
      });
    }
  });

  // Voice chat WebRTC signaling
  socket.on('offer', (data) => {
    const { to, offer } = data;
    io.to(to).emit('offer', {
      from: socket.id,
      offer
    });
  });

  socket.on('answer', (data) => {
    const { to, answer } = data;
    io.to(to).emit('answer', {
      from: socket.id,
      answer
    });
  });

  socket.on('ice_candidate', (data) => {
    const { to, candidate } = data;
    io.to(to).emit('ice_candidate', {
      from: socket.id,
      candidate
    });
  });

  socket.on('call_user', (data) => {
    const { userId } = data;
    io.to(userId).emit('incoming_call', {
      from: socket.id,
      fromUser: users.get(socket.id)?.username || 'Unknown'
    });
  });

  socket.on('call_accepted', (data) => {
    io.to(data.from).emit('call_accepted', {
      callerId: data.from
    });
  });

  socket.on('call_declined', (data) => {
    io.to(data.from).emit('call_declined', {
      userId: socket.id
    });
  });

  socket.on('disconnect', () => {
    const user = users.get(socket.id);
    if (user) {
      const roomUsers = rooms.get(user.roomId);
      if (roomUsers) {
        rooms.set(user.roomId, roomUsers.filter(id => id !== socket.id));
      }
      
      io.to(user.roomId).emit('user_left', {
        username: user.username,
        userId: socket.id,
        usersInRoom: rooms.get(user.roomId).length
      });
    }
    users.delete(socket.id);
    console.log(`User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
