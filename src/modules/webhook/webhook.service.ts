import { Injectable } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma";
import { WebhookDto } from "./dto/webhook.dto";

@Injectable()
export class WebhookService {
  constructor(private readonly prisma: PrismaService) {}

  async handleWebhook(webhookDto: WebhookDto): Promise<void> {
    const { orderId, status } = webhookDto;
    if (status === "complete") {
      await this.prisma.user.update({
        where: { chatId: orderId.toString() },
        data: {
          status: "subscribed",
          endTime: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000),
        },
      });
    }
  }
}
