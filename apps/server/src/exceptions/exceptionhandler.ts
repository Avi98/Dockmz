import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  HttpException,
  UnauthorizedException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

export const mapOfErrorToHTTPError = new Map([
  [
    'InValidPayload',
    (object): HttpException => new BadRequestException(object),
  ],
  ['AlreadyInDB', (object): HttpException => new BadRequestException(object)],
  ['NotInDB', (object): HttpException => new BadRequestException(object)],
  [
    'InValidUserSession',
    (object): HttpException => new UnauthorizedException(object),
  ],
]);

@Catch()
export class ExceptionFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    super.catch(ExceptionFilter.transformLocalErrors(exception as Error), host);
  }

  static transformLocalErrors(error: Error): Error {
    console.log({ errorCaught: error });
    const errorConst = mapOfErrorToHTTPError.get(error.name);
    if (!errorConst) return error;

    return errorConst({ name: error.name, message: error.message });
  }
}