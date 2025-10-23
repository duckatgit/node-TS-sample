import { Server, Socket } from "socket.io";
import { eventTags } from "../common/eventTags";
import driverController from "../controller/driverController";
import { getIO } from "../service/socketConfig.service";


export const registerDriverEvents = (socket: Socket) => {
  const io: Server = getIO();

  socket.on(eventTags.DRIVER_ACCEPT_RIDE, (data) => driverController.acceptRide(data));
  // socket.on("driver:rejectRide", (data) => rideController.rejectRide(data));
  socket.on(eventTags.DRIVER_UPDATE_LOCATION, (data) => driverController.updateLocation(data));
};
