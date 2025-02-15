// src/socket.js
import { io } from "socket.io-client";

const socket = io("https://event-lify-backend.onrender.com", { withCredentials: true });
export default socket;
