import { Server, Socket } from "socket.io";
import { eventTags } from "./common/eventTags";
import { registerDriverEvents } from "./events/driver.events";
import logger from "./service/logger";
import { registerRiderEvents } from "./events/rider.events";
import http from "http";

export const setupSocket = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    logger.info(`Client connected: ${socket.id}`);

    // When app connects, it should send its Id immediately
    socket.on(eventTags.REGISTER_USER, (body: any) => {
      socket.join(body.id);
      logger.info(`User ${body.id} joined room`);
    });

    registerDriverEvents(socket);
    registerRiderEvents(socket);

    socket.on("disconnect", () => {
      logger.info("Client disconnected:", socket.id);
    });
  });
};
