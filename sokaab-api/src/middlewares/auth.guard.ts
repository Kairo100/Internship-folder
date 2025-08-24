import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from './public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      // 💡 See this condition
      return true;
    }

    const request = context.switchToHttp().getRequest();

    // Checking API key for Dahabshiil
    const apiKey = request.headers['x-api-key'];
    const apiSecret = request.headers['x-api-secret'];

    // Check for API Key first
    // if (apiKey && apiKey === process.env.DAHABSHIIL_SECRET_API_KEY) {
    //   return true;
    // }

    // console.log('apiKey', apiKey);
    // console.log('x-api-secret: ', apiSecret);
    if (
      apiKey &&
      apiKey === process.env.DAHABSHIIL_API_KEY &&
      apiSecret &&
      apiSecret === process.env.DAHABSHIIL_API_SECRET
    ) {
      return true; // If both API key and secret are valid, grant access
    }

    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
