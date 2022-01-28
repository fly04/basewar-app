import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable } from '@angular/core';

@Injectable()
export class ErrorService implements ErrorHandler {
  handleError(error: any) {
    if (error instanceof HttpErrorResponse) {
      console.error('Request Error', error);
    } else {
      console.error('Error from global error handler', error);
    }
  }
}
