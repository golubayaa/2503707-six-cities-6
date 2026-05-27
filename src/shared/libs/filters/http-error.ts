import { StatusCodes } from 'http-status-codes';

export class HttpError extends Error {
  public httpStatusCode: StatusCodes;
  public detail?: string;

  constructor(httpStatusCode: StatusCodes, message: string, detail?: string) {
    super(message);
    this.httpStatusCode = httpStatusCode;
    this.detail = detail;
  }
}
