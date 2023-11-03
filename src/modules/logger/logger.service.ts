import { LoggerService } from '@nestjs/common';

export class MyLogger implements LoggerService {
  log(message: any, ...optionalParams: any[]): void {
    console.log(message, ...optionalParams);
  }

  fatal(message: any, ...optionalParams: any[]): void {
    console.error(message, ...optionalParams);
  }

  error(message: any, ...optionalParams: any[]): void {
    console.error(message, ...optionalParams);
  }

  warn(message: any, ...optionalParams: any[]): void {
    console.warn(message, ...optionalParams);
  }

  debug(message: any, ...optionalParams: any[]): void {
    console.log(message, ...optionalParams);
  }

  verbose(message: any, ...optionalParams: any[]): void {
    console.log(message, ...optionalParams);
  }
}
