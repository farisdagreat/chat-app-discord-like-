<template>
  <div class="flex h-screen bg-gray-900">
    <!-- Sidebar -->
    <div class="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
      <div class="p-4 border-b border-gray-700">
        <h1 class="text-xl font-bold text-white flex items-center gap-2">
          <span class="text-2xl">💬</span> ChatVoice
        </h1>
      </div>
      
      <!-- Room Selection -->
      <div class="flex-1 overflow-y-auto p-3">
        <h3 class="text-xs font-semibold text-gray-400 uppercase px-2 mb-3">Servers</h3>
        <div 
          v-for="room in availableRooms" 
          :key="room.id"
          @click="selectRoom(room.id)"
          :class="['p-3 rounded-lg cursor-pointer transition-all', 
            currentRoom === room.id 
              ? 'bg-blue-600 text-white' 
              : 'text-gray-300 hover:bg-gray-700']"
        >
          {{ room.name }}
          <span v-if="room.users > 0" class="ml-2 text-xs">{{ room.users }}</span>
        </div>
      </div>

      <!-- User Info -->
      <div class="p-4 border-t border-gray-700 bg-gray-750">
        <input
          v-if="!isConnected"
          v-model="username"
          placeholder="Your name..."
          class="w-full px-3 py-2 rounded bg-gray-700 text-white text-sm mb-2 placeholder-gray-500"
          @keyup.enter="connectToChat"
        />
        <button
          v-if="!isConnected"
          @click="connectToChat"
          class="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold transition"
        >
          Join Chat
        </button>
        <div v-else class="text-sm">
          <p class="text-gray-400">Connected as:</p>
          <p class="text-white font-semibold">{{ username }}</p>
          <button
            @click="disconnect"
            class="w-full mt-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition text-sm"
          >
            Disconnect
          </button>
        </div>
      </div>
    </div>

    <!-- Main Chat Area -->
    <div v-if="!isConnected" class="flex-1 bg-gray-900 flex flex-col items-center justify-center">
      <div class="text-center">
        <div class="text-6xl mb-4">👋</div>
        <h2 class="text-3xl font-bold text-white mb-2">Welcome to ChatVoice</h2>
        <p class="text-gray-400 mb-8">Type your name and join a chat room to get started</p>
      </div>
    </div>

    <div v-else class="flex-1 flex flex-col bg-gray-900">
      <!-- Header -->
      <div class="bg-gray-800 border-b border-gray-700 p-4 flex justify-between items-center">
        <div>
          <h2 class="text-xl font-bold text-white">{{ currentRoomName }}</h2>
          <p class="text-sm text-gray-400">{{ onlineUsers }} users online</p>
        </div>
        <div class="flex gap-2">
          <button
            @click="toggleVoiceCall"
            :class="['px-4 py-2 rounded font-semibold transition flex items-center gap-2',
              voiceCallActive 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-green-600 hover:bg-green-700 text-white']"
          >
            <span>🎤</span>
            {{ voiceCallActive ? 'End Call' : 'Start Call' }}
          </button>
        </div>
      </div>

      <!-- Chat Messages -->
      <div class="flex-1 overflow-y-auto p-6 space-y-4">
        <div 
          v-for="(msg, idx) in messages" 
          :key="idx"
          class="flex gap-3 items-start animate-fadeIn"
        >
          <div class="text-2xl">{{ msg.avatar }}</div>
          <div class="flex-1">
            <p class="text-sm text-gray-400">
              <span class="text-white font-semibold">{{ msg.username }}</span>
              <span class="ml-2">{{ formatTime(msg.timestamp) }}</span>
            </p>
            <p class="text-white break-words">{{ msg.content }}</p>
          </div>
        </div>

        <!-- System Messages -->
        <div 
          v-for="(sys, idx) in systemMessages" 
          :key="`sys-${idx}`"
          class="text-center text-sm text-gray-500 py-2"
        >
          {{ sys }}
        </div>
      </div>

      <!-- Voice Call UI -->
      <div v-if="voiceCallActive" class="bg-gray-800 border-t border-gray-700 p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <span class="text-lg">🎧</span>
            <p class="text-white">Voice call active</p>
            <span class="text-sm text-green-400">● Live</span>
          </div>
          <div class="flex gap-2">
            <button
              @click="toggleMicrophone"
              :class="['px-3 py-2 rounded transition flex items-center gap-2',
                microphoneActive 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-gray-700 hover:bg-gray-600']"
            >
              {{ microphoneActive ? '🎤' : '🔇' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Message Input -->
      <div class="bg-gray-800 border-t border-gray-700 p-4">
        <div class="flex gap-3">
          <input
            v-model="messageInput"
            placeholder="Send a message..."
            class="flex-1 px-4 py-3 rounded bg-gray-700 text-white placeholder-gray-500 focus:outline-none focus:bg-gray-650 transition"
            @keyup.enter="sendMessage"
          />
          <button
            @click="sendMessage"
            class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { io } from 'socket.io-client'

// State
const socket = ref(null)
const username = ref('')
const isConnected = ref(false)
const currentRoom = ref('general')
const messages = ref([])
const systemMessages = ref([])
const messageInput = ref('')
const voiceCallActive = ref(false)
const microphoneActive = ref(true)
const onlineUsers = ref(0)

// Available rooms
const availableRooms = ref([
  { id: 'general', name: '# general', users: 0 },
  { id: 'random', name: '# random', users: 0 },
  { id: 'gaming', name: '# gaming', users: 0 },
  { id: 'music', name: '# music', users: 0 }
])

const currentRoomName = computed(() => {
  return availableRooms.value.find(r => r.id === currentRoom.value)?.name || 'Chat'
})

const connectToChat = async () => {
  if (!username.value.trim()) return

  socket.value = io('http://localhost:3000', {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5
  })

  socket.value.on('connect', () => {
    console.log('Connected to server')
    isConnected.value = true
    socket.value.emit('user_join', {
      username: username.value,
      roomId: currentRoom.value
    })
  })

  socket.value.on('receive_message', (data) => {
    messages.value.push(data)
  })

  socket.value.on('user_joined', (data) => {
    systemMessages.value.push(`${data.username} joined the chat`)
    onlineUsers.value = data.usersInRoom
    setTimeout(() => systemMessages.value.shift(), 3000)
  })

  socket.value.on('user_left', (data) => {
    systemMessages.value.push(`${data.username} left the chat`)
    onlineUsers.value = data.usersInRoom
    setTimeout(() => systemMessages.value.shift(), 3000)
  })

  socket.value.on('incoming_call', (data) => {
    if (confirm(`${data.fromUser} is calling you. Accept?`)) {
      socket.value.emit('call_accepted', { from: data.from })
      voiceCallActive.value = true
    } else {
      socket.value.emit('call_declined', { from: data.from })
    }
  })

  socket.value.on('call_accepted', () => {
    voiceCallActive.value = true
  })
}

const sendMessage = () => {
  if (!messageInput.value.trim() || !socket.value) return

  socket.value.emit('send_message', {
    content: messageInput.value,
    avatar: username.value.charAt(0).toUpperCase()
  })
  messageInput.value = ''
}

const selectRoom = (roomId) => {
  if (isConnected.value) {
    currentRoom.value = roomId
    messages.value = []
  } else {
    currentRoom.value = roomId
  }
}

const toggleVoiceCall = () => {
  if (!isConnected.value) return

  if (!voiceCallActive.value) {
    socket.value.emit('call_user', { userId: socket.value.id })
  }
  voiceCallActive.value = !voiceCallActive.value
}

const toggleMicrophone = () => {
  microphoneActive.value = !microphoneActive.value
}

const disconnect = () => {
  if (socket.value) {
    socket.value.disconnect()
  }
  isConnected.value = false
  messages.value = []
  voiceCallActive.value = false
}

const formatTime = (timestamp) => {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

onUnmounted(() => {
  if (socket.value) {
    socket.value.disconnect()
  }
})
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-in-out;
}
</style>
