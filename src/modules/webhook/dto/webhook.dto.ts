import { IsString } from "class-validator";

export class WebhookDto {
  @IsString()
  orderId: string;

  @IsString()
  status: string;
}
