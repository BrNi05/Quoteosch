import { ThrottlerGuard } from '@nestjs/throttler';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';

// Throttle requests based on the IP address
@Injectable()
export class ThrottleGuard extends ThrottlerGuard {
  protected async getTracker(req: Request): Promise<string> {
    const ip = req.ip ?? req.socket.remoteAddress ?? 'unknown'; // req.ip is always set, 'unknown' will never be reached, req.ip is not spoofable
    return Promise.resolve(ip);
  }
}
