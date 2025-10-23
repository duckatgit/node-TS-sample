import { ForgotPassword } from "./forgotPassword.model";
import Payment from "./payment.model";
import Refund from "./refund.model";
import { Ride } from "./ride.model";
import { RideFare } from "./rideFare.model";
import Subscription from "./subscription.model";
import { TempUser } from "./tempUser.model";
import User from "./user.model";
import { UserBank } from "./userBank.model";
import { UserDocument } from "./userDocument.model";
import { Vehicle } from "./vehicle.model";
import { VehicleDocument } from "./vehicleDocument.model";


const tempUserModel = TempUser;
const userModel = User;
const userDocumentModel = UserDocument;
const vehicleModel = Vehicle;
const vehicleDocumentModel = VehicleDocument;
const userBankModel = UserBank;
const forgotPasswordModel = ForgotPassword;
const rideModel = Ride;
const rideFareModel = RideFare;
const paymentModel = Payment;
const refundModel = Refund;
const subscriptionModel = Subscription;


export {
    forgotPasswordModel, 
    rideFareModel, 
    rideModel, 
    tempUserModel, 
    userBankModel, 
    userDocumentModel, 
    userModel, 
    vehicleDocumentModel, 
    vehicleModel,
    paymentModel,
    refundModel,
    subscriptionModel,
};
