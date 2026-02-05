# ChatVoice - Discord-Like Chat App

A modern, full-stack chat application with real-time messaging and voice chat capabilities.

## Features

✨ **Real-Time Messaging** - Built with Socket.io for instant message delivery
🎤 **Voice Chat** - WebRTC peer-to-peer voice communication  
💬 **Multiple Rooms** - Join different chat channels (general, random, gaming, music)
🎨 **Modern Discord-Like UI** - Dark theme with smooth animations
👥 **User Management** - See who's online in each room
🔄 **Live User Status** - Real-time notifications when users join/leave

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Socket.io** - Real-time bidirectional communication
- **CORS** - Cross-origin resource sharing

### Frontend
- **Vue 3** - Progressive JavaScript framework
- **Vite** - Next generation build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Socket.io Client** - Client-side connection library

## Quick Start

### Prerequisites
- Node.js (v16+)
- npm or yarn

### Installation & Running

**1. Start the Backend**
```bash
cd backend
npm install
npm run dev
```

**2. Start the Frontend**
```bash
cd frontend
npm install
npm run dev
```

**3. Open in Browser**
Visit `http://localhost:5173`

## How to Use

1. Enter your username and click "Join Chat"
2. Select a room from the sidebar
3. Send messages in real-time
4. Start a voice call with the microphone button
5. See live user count and notifications

## Features

**Chat System**
- Real-time Socket.io messaging
- Multiple chat rooms
- User join/leave notifications
- Message timestamps
- User avatars

**Voice Chat**
- WebRTC peer-to-peer
- Microphone toggle
- Call accept/decline

**UI**
- Discord-inspired dark theme
- Responsive sidebar
- Smooth animations
- Modern Tailwind CSS styling

## Architecture

Backend: Node.js + Express + Socket.io
Frontend: Vue 3 + Vite + Tailwind CSS
Real-time: WebSocket + WebRTC

## API Events

### Emit
- `user_join` - Join a room
- `send_message` - Send message
- `call_user` - Initiate call
- `offer/answer/ice_candidate` - WebRTC signaling

### Receive  
- `receive_message` - New message
- `user_joined/user_left` - User status
- `incoming_call` - Call notification
- `offer/answer/ice_candidate` - WebRTC signaling

Built with Vue, Node.js, and WebRTC for seamless communication!
