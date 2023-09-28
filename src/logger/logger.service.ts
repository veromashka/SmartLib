import { ConsoleLogger } from '@nestjs/common';

export class MyLogger extends ConsoleLogger {
  error(message: any, stack?: string, context?: string) {
    if (stack) {
      // If a stack trace is provided, log the error with the stack trace
      super.error(message, stack, context);
    } else {
      // If no stack trace is provided, log the error without it
      super.error(message, context);
    }
  }
}
