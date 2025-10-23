export const constants = {
  TRUE: 1,
  FALSE: 0,
  ANY: -1,
  BLANK: '',
  PASSWORD_MAX_LENGTH: 8,
  OTHER: 'OTHER',
  INSERT: 'INSERT',
  UPDATE: 'UPDATE',
  RIDER:'RIDER',
  ADMIN:'ADMIN',
  DRIVER:'DRIVER',
  INVESTOR: 'INVESTOR',
  SYSTEM: 'SYSTEM',
  MAIN: 'MAIN',
  TEMP: 'TEMP',
  NONE: 'NONE',
  OTP_ATTEMPT: 5,
  OTP_EXPIRE_MINUTES: 5,
  OTP_LENGTH: 6,
  RESET_PASS_TOKEN_EXPIRE_MINUTE: 10,
  USER_DETAILS_STAGE: 0,
  IDENTIRY_VERIFICATION_STAGE: 1,
  VEHICLE_INFO_STAGE: 2,
  BANK_INFO_STAGE: 3,
  REVIEW_STAGE: 4,
  FILE_UPLOAD_PATH: 'uploads/images',
  REQUESTED: 0, 
  ACCEPTED: 1,  
  ARRIVED: 2,   
  STARTED: 3,   
  COMPLETED: 4, 
  CANCELLED: -1,
  NO_SHOW: -2,
  INITIATE: 100,
  PAID: 200,
  FAILED: 201,
  REFUNDED: 202,
  CASH: 'CASH',
  CARD: 'CARD',
  WALLET: 'WALLET',
  UPI: 'UPI',
  KM_RADIUS_DRIVER: 5,
  KM_RADIUS_RIDER: 5,
  RIDE_REQUEST_EXPIRE_SECOND: 60,
} as const;

export type ConstantKeys = keyof typeof constants;
export type ConstantValues = (typeof constants)[ConstantKeys];

export const redisKeys = {
  DRIVER_LOCATION: 'DRIVER_LOCATION',
  USER_LOCATION: 'USER_LOCATION',
  DRIVER_STATUS: 'DRIVER_STATUS',
};

interface FileField {
  name: string;
  maxCount: number;
};

export const documentFileKeys = {
  PROFILE_PIC:'PROFILE_PIC',
  DRIVER_LICENCE:'DRIVER_LICENCE',
  ID_PROOF:'ID_PROOF',
  VEHICLE_INSURANCE:'VEHICLE_INSURANCE',
  VEHICLE_RC:'VEHICLE_RC',
}

export const userVerificationFields: FileField[] = [
  { name: documentFileKeys.PROFILE_PIC, maxCount: 1 },
  { name: documentFileKeys.DRIVER_LICENCE, maxCount: 1 },
  { name: documentFileKeys.ID_PROOF, maxCount: 1 },
];

export const vehicleImageFields: FileField[] = [
  { name: documentFileKeys.VEHICLE_INSURANCE, maxCount: 1 },
  { name: documentFileKeys.VEHICLE_RC, maxCount: 1 },
];

export const stripeWebhookEvents =  {
  PAYMENT_SUCCESS:"payment_intent.succeeded",
  PAYMENT_FAILED:"payment_intent.payment_failed",
  INVOICE_PAYMENT_SUCCESS:"invoice.payment_succeeded",
  INVOICE_PAYMENT_FAILED:"invoice.payment_failed",
}