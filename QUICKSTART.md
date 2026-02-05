# 🚀 Quick Start Guide - ChatVoice

Get your chat app running in 3 easy steps!

## Step 1: Install Dependencies

```bash
# On Linux/Mac
chmod +x setup.sh
./setup.sh

# Or on Windows
setup.bat

# Or manually:
cd backend && npm install
cd ../frontend && npm install
```

## Step 2: Start the Backend Server

Open a terminal and run:

```bash
cd backend
npm run dev
```

You should see:
```
Server running on http://localhost:3000
```

## Step 3: Start the Frontend

Open another terminal and run:

```bash
cd frontend
npm run dev
```

You should see:
```
Local: http://localhost:5173
```

## Step 4: Open in Browser

Navigate to **http://localhost:5173** in your web browser

## Using the App

1. **Enter Your Username** - Type your name in the sidebar
2. **Click "Join Chat"** - Connect to the chat server
3. **Pick a Room** - Select general, random, gaming, or music
4. **Send Messages** - Type and press Enter or click Send
5. **Voice Chat** - Click the microphone button to start a call
6. **Toggle Mic** - Use the microphone button during a call to mute/unmute

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Can't connect | Make sure backend is running on localhost:3000 |
| Port 3000 in use | Change PORT in backend/server.js |
| Port 5173 in use | Vite will auto-increment to 5174 or change in vite.config.js |
| Socket.io connection error | Check CORS settings in backend/server.js |
| No messages showing | Check browser console for errors |

## Project Structure

```
├── backend/
│   ├── server.js        ← Main Socket.io server
│   └── package.json     ← Dependencies
└── frontend/
    ├── src/
    │   ├── App.vue      ← Main chat UI component
    │   └── styles/      ← Tailwind CSS
    └── package.json
```

## Key Technologies

- **Backend**: Node.js + Express + Socket.io
- **Frontend**: Vue 3 + Vite + Tailwind CSS
- **Communication**: WebSocket (messages) + WebRTC (voice)

## Next Steps

- Add authentication
- Implement actual WebRTC voice calls
- Add database for message persistence
- Deploy to cloud (Heroku, Vercel)
- Add emoji reactions
- Implement user profiles

## Need Help?

Check the main README.md for full documentation!

Happy chatting! 💬🎤
