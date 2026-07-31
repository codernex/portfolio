import { createParamDecorator } from '@nestjs/common';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { Request } from 'express';

export const AuthUser = createParamDecorator(
  (_, context: ExecutionContextHost) => {
    const request = context.switchToHttp().getRequest<Request>();
    if (!request.user) return null;
    return request.user;
  },
);
