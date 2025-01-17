import {
  ClassSerializerInterceptor,
  Logger,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { AppController } from "./app.controller";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { IConfig, IThrottleConfig, validateConfig } from "../config";
import { PrismaModule, QueryInfo, loggingMiddleware } from "nestjs-prisma";
import { LoggerMiddleware, RealIpMiddleware } from "src/common/middleware";
import { BotModule } from "../bot/bot.module";
import { WebhookModule } from "../webhook/webhook.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validate: (config: Record<string, any>) => {
        return validateConfig(config);
      },
    }),
    ThrottlerModule.forRootAsync({
      useFactory: (config: ConfigService<IConfig>) => [
        {
          ttl: config.get<IThrottleConfig>("throttle").ttl,
          limit: config.get<IThrottleConfig>("throttle").limit,
        },
      ],
      inject: [ConfigService],
    }),
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        explicitConnect: true,
        middlewares: [
          loggingMiddleware({
            logger: new Logger("PrismaMiddleware"),
            logLevel: "log",
            logMessage: (query: QueryInfo) =>
              `[Prisma Query] ${query.model}.${query.action} - ${query.executionTime}ms`,
          }),
        ],
      },
    }),
    BotModule,
    WebhookModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware, RealIpMiddleware)
      .forRoutes({ path: "*", method: RequestMethod.ALL });
  }
}
