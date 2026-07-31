import { ExecutionContext, Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Request } from 'express';

@Injectable()
export class AnonymousThrottlerGuard extends ThrottlerGuard {
  protected errorMessage: string = 'Too many requests, please try again later.';
  // async canActivate(context: ExecutionContext): Promise<boolean> {
  //   const request = context.switchToHttp().getRequest();
  //   // Check if the user is authenticated (e.g., based on `request.user`)
  //   if (request.user) {
  //     console.log(request.user);

  //     return true;
  //   }

  //   // Apply rate limiting for anonymous users
  //   return super.canActivate(context);
  // }
  // eslint-disable-next-line @typescript-eslint/require-await
  protected async shouldSkip(_context: ExecutionContext): Promise<boolean> {
    const request = _context.switchToHttp().getRequest<Request>();
    if (request.user) {
      return true; // Skip rate limiting
    }
    return false; // Apply rate limiting
  }
}
