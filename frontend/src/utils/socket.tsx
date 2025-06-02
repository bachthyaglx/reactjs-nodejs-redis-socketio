import { io } from 'socket.io-client'

// Standardization via NGINX reverse proxy
export const socket = io('/', {
  path: '/socket.io',
})

