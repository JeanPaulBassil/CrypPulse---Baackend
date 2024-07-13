import { CacheInterceptor } from "@nestjs/cache-manager";
import type { ExecutionContext } from "@nestjs/common";
import { Injectable } from "@nestjs/common";
import { IGNORE_CACHING_META } from "../constants";

/* If the ignoreCaching metadata is set to true, then the request will not be cached. */

@Injectable()
export class HttpCacheInterceptor extends CacheInterceptor {
  protected isRequestCacheable(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();

    const ignoreCaching: boolean = this.reflector.get(
      IGNORE_CACHING_META,
      context.getHandler(),
    );

    return !ignoreCaching && request.method === "GET";
  }
}
