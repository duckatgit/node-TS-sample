import { Server, Socket } from "socket.io";
import { eventTags } from "../common/eventTags";
import riderController from "../controller/riderController";
import { getIO } from "../service/socketConfig.service";

export const registerRiderEvents = (socket: Socket) => {
  const io = getIO();

  socket.on(eventTags.REQUEST_RIDE, (data) => riderController.requestRide(data));
  // socket.on("driver:rejectRide", (data) => rideController.rejectRide(data));
  
};
