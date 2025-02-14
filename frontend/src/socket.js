// src/socket.js
import { io } from "socket.io-client";

const socket = io(process.env.BACKENDURL, { withCredentials: true });
export default socket;
