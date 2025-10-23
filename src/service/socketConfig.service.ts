import http from "http";
import { Server } from "socket.io";

let io: Server;

export const initSocket = (server: http.Server) => {
  io = new Server(server, { cors: { origin: "*" } });
  return io;
};

export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized!");
  return io;
};