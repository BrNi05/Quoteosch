import { ThrottlerGuard } from '@nestjs/throttler';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class ThrottleGuard extends ThrottlerGuard {
  protected async getTracker(req: Request): Promise<string> {
    // First try Cloudflare header, fallback to standard Express IP
    // Docs: https://developers.cloudflare.com/fundamentals/reference/http-headers/#cf-connecting-ip
    const ip =
      (req.headers['cf-connecting-ip'] as string) ?? // This header contains the public IP, which is really not a ideal for proper rate limiting
      req.ip ??
      req.socket.remoteAddress;
    return Promise.resolve(ip);
  }
}
