import axios from "axios";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class CheckPaymentService {
  constructor(private configService: ConfigService) {}

  async checkBTCPayPayment(invoiceId: string): Promise<boolean> {
    try {
      const response = await axios.get(
        `${this.configService.get("BTCPAY_URL")}/invoices/${invoiceId}`,
        {
          headers: {
            "Content-Type": "application/json",
            "X-Api-Key": this.configService.get("BTCPAY_API_KEY"),
          },
        },
      );
      return response.data.data.status === "complete";
    } catch (error) {
      console.error("Error checking BTCPay payment:", error);
      return false;
    }
  }
}
