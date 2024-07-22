import { Module } from "@nestjs/common";
import { TelegrafModule } from "nestjs-telegraf";
import { BotService } from "./bot.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { PrismaModule } from "nestjs-prisma";
import { CreateInvoiceService } from "./util/createInvoice";
import { CheckPaymentService } from "./util/checkPayment";

@Module({
  imports: [
    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        token: configService.get<string>("TELEGRAM_API_TOKEN"),
      }),
      inject: [ConfigService],
    }),
    PrismaModule,
    ConfigModule,
  ],
  providers: [BotService, CreateInvoiceService, CheckPaymentService],
})
export class BotModule {}
