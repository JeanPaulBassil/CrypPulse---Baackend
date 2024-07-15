import { IsNotEmpty, IsString } from "class-validator";

export class DeletePaymentDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}
