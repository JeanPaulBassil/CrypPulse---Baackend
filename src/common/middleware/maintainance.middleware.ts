import type { NestMiddleware } from "@nestjs/common";
import { Injectable, ServiceUnavailableException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { NextFunction, Request, Response } from "express";
import { IConfig, INestConfig } from "src/modules/config";

@Injectable()
export class SettingMaintenanceMiddleware implements NestMiddleware {
  constructor(private configService: ConfigService<IConfig>) {}
  async use(
    _request: Request,
    _response: Response,
    next: NextFunction,
  ): Promise<void> {
    const maintenance: boolean =
      this.configService.get<INestConfig>("nest").isMaintenanceMode;

    if (maintenance) {
      throw new ServiceUnavailableException({
        statusCode: 503,
        message: "Service is under maintenance",
      });
    }

    next();
  }
}
