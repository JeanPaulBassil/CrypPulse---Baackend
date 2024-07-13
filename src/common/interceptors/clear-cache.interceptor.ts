import { Injectable } from "@nestjs/common";
import type { Observable } from "rxjs";
import { tap } from "rxjs";
import type {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from "@nestjs/common";
import { CacheService } from "src/modules/cache/cache.service";

/**
 *
 *  This interceptor is used to automatically clear the cache after a successful mutation.
 *
 */
@Injectable()
export class ClearCacheInterceptor implements NestInterceptor {
  constructor(private readonly cacheService: CacheService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();

    return next.handle().pipe(
      tap(() => {
        const statusCode = context.switchToHttp().getResponse().statusCode;
        if (request.method !== "GET" && statusCode >= 200 && statusCode < 300) {
          const url = request.url;
          const regex = /\/api\/([\w-]+)/;
          const baseUrl = url.match(regex)[0];
          this.cacheService.deleteMatch(baseUrl);
        } else {
          return;
        }
      }),
    );
  }
}
