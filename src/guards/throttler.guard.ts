import { ThrottlerGuard } from '@nestjs/throttler';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class ThrottleGuard extends ThrottlerGuard {
  protected async getTracker(req: Request): Promise<string> {
    // First try Cloudflare header, fallback to standard Express IP
    // Docs: https://developers.cloudflare.com/fundamentals/reference/http-headers/#cf-connecting-ip
    const ip =
      (req.headers['cf-connecting-ip'] as string) || // If a fallback happens, rate limiting will affect every user
      req.ip ||
      req.socket.remoteAddress ||
      'unknown';
    return Promise.resolve(ip);
  }
}
