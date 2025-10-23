import status from './status'

interface SuccessResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  isSuccess: boolean;
}

interface FailResponse {
  statusCode: number;
  message: string;
}

export function successAction<T>(
  data: T,
  message = "ok",
  isSuccess = true
): SuccessResponse<T> {
  return {
    statusCode: status.SUCCESS,
    data,
    message,
    isSuccess,
  };
}

export function failAction(message: string, code: number): FailResponse {
  return {
    statusCode: code,
    message,
  };
}
