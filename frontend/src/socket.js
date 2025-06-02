import { io } from 'socket.io-client'

export const socket = io('http://localhost') // via NGINX (port 80)
