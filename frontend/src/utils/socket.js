import { io } from 'socket.io-client'

// Cách chuẩn khi dùng qua NGINX reverse proxy
export const socket = io('/', {
  path: '/socket.io',
})
