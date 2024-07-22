import { Injectable, OnModuleInit } from "@nestjs/common";
import { InjectBot } from "nestjs-telegraf";
import { Telegraf } from "telegraf";
import { PrismaService } from "nestjs-prisma";
import { CreateInvoiceService } from "./util/createInvoice";
import { CheckPaymentService } from "./util/checkPayment";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class BotService implements OnModuleInit {
  constructor(
    @InjectBot() private readonly bot: Telegraf,
    private readonly prisma: PrismaService,
    private readonly createInvoiceService: CreateInvoiceService,
    private readonly checkPaymentService: CheckPaymentService,
    private readonly configService: ConfigService,
  ) {
    this.bot.command("start", (ctx) => this.handleStartCommand(ctx));
    this.bot.command("subscribe", (ctx) => this.handleSubscribeCommand(ctx));
  }

  async onModuleInit() {
    const webhookUrl = `${this.configService.get("APP_URL")}/telegram-webhook`;
    await this.bot.telegram.setWebhook(webhookUrl);
  }

  async handleUpdate(update: any): Promise<void> {
    this.bot.handleUpdate(update);
  }

  async handleStartCommand(ctx) {
    const chatId = ctx.chat.id;
    await this.prisma.user.upsert({
      where: { chatId: chatId.toString() },
      update: {},
      create: {
        chatId: chatId.toString(),
        status: "trial",
        startTime: new Date(),
        endTime: new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000),
      },
    });
    ctx.reply("Welcome to CryptoPulse! Enjoy your free 2-week trial.");
  }

  async handleSubscribeCommand(ctx) {
    const chatId = ctx.chat.id;
    const user = await this.prisma.user.findUnique({
      where: { chatId: chatId.toString() },
    });
    if (user.status === "subscribed") {
      ctx.reply("You are already subscribed.");
    } else {
      const paymentLink = await this.createInvoiceService.createBTCPayInvoice(
        chatId,
        19.99,
        "USD",
      );
      if (paymentLink) {
        ctx.reply(`Please pay 19.99 USD to subscribe: ${paymentLink}`);
        await this.prisma.user.update({
          where: { chatId: chatId.toString() },
          data: { status: "pending", paymentLink: paymentLink },
        });
        this.checkPayment(chatId);
      } else {
        ctx.reply("Error creating payment link. Please try again later.");
      }
    }
  }

  private async checkPayment(chatId: number) {
    const user = await this.prisma.user.findUnique({
      where: { chatId: chatId.toString() },
    });
    const paymentCompleted = await this.checkPaymentService.checkBTCPayPayment(
      user.paymentLink,
    );
    if (paymentCompleted) {
      await this.prisma.user.update({
        where: { chatId: chatId.toString() },
        data: {
          status: "subscribed",
          endTime: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000),
        },
      });
      this.bot.telegram.sendMessage(
        chatId,
        "Payment received! Your subscription is now active.",
      );
    } else {
      this.bot.telegram.sendMessage(
        chatId,
        "Waiting for payment... Please complete your payment to activate your subscription.",
      );
      setTimeout(() => this.checkPayment(chatId), 60000);
    }
  }
}
