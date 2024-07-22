import { Controller, Post, Req } from "@nestjs/common";
import { Request } from "express";
import { BotService } from "../bot.service";

@Controller("telegram-webhook")
export class TelegramWebhookController {
  constructor(private readonly botService: BotService) {}

  @Post()
  async handleWebhook(@Req() req: Request): Promise<void> {
    await this.botService.handleUpdate(req.body);
  }
}
