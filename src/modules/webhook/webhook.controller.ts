import { Controller, Post, Body, Res } from "@nestjs/common";
import { WebhookService } from "./webhook.service";
import { WebhookDto } from "./dto/webhook.dto";

@Controller("btcpay-webhook")
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post()
  async handleWebhook(
    @Body() webhookDto: WebhookDto,
    @Res() res,
  ): Promise<void> {
    await this.webhookService.handleWebhook(webhookDto);
    res.sendStatus(200);
  }
}
