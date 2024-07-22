import axios from "axios";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class CreateInvoiceService {
  constructor(private configService: ConfigService) {}

  async createBTCPayInvoice(
    userId: number,
    amount: number,
    currency: string,
  ): Promise<string | null> {
    try {
      const response = await axios.post(
        `${this.configService.get("BTCPAY_URL")}/invoices`,
        {
          price: amount,
          currency: currency,
          orderId: userId.toString(),
          storeId: this.configService.get("BTCPAY_STORE_ID"),
          notificationURL: `${this.configService.get("APP_URL")}/btcpay-webhook`,
          token: this.configService.get("BTCPAY_API_KEY"),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      return response.data.data.url;
    } catch (error) {
      console.error("Error creating BTCPay invoice:", error);
      return null;
    }
  }
}
