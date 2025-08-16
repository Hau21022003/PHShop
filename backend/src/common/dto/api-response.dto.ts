export class ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;

  constructor(success: boolean, message?: string, data?: T) {
    this.success = success;
    this.message = message;
    this.data = data;
  }

  static ok<T>(data: T, message = 'Success') {
    return new ApiResponse<T>(true, message, data);
  }

  static error(message = 'Error', data?: any) {
    return new ApiResponse(false, message, data);
  }
}
