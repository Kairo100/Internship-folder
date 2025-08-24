import {
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import { ZodObject, ZodError, ZodIssue } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodObject<any>) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    try {
      this.schema.parse(value);
    } catch (error) {
      //   throw new BadRequestException('Validation failed');
      if (error instanceof ZodError) {
        const errorMessage = this.buildErrorMessage(error.errors);
        throw new BadRequestException(errorMessage);
      } else {
        throw new BadRequestException('Validation failed');
      }
    }
    return value;
  }

  private buildErrorMessage(issues: ZodIssue[]) {
    const errorMessages = issues.map((issue) => {
      return {
        message: issue.message,
        path: issue.path[0],
      };
    });

    return {
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Validation failed',
      errors: errorMessages,
    };
  }
}
