import type { NestMiddleware } from "@nestjs/common";
import { Injectable } from "@nestjs/common";
import type { NextFunction, Request, Response } from "express";
import { CacheService } from "src/modules/cache/cache.service";

// This middleware is used to clear the cache when the query parameter "clearCache" is present
@Injectable()
export class ClearCacheMiddleware implements NestMiddleware {
  constructor(private readonly cacheService: CacheService) {}

  async use(request: Request, _response: Response, next: NextFunction) {
    request.query?.clearCache === "true" &&
      (await this.cacheService.resetCache());
    next();
  }
}