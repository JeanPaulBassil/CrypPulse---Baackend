import { DuePaymentEntity } from "src/common/entities/payment.entity";
import { IsNotEmpty, IsNumber, IsString, IsDate } from "class-validator";
import { OmitType } from "@nestjs/swagger";

export class CreatePaymentDto extends OmitType(DuePaymentEntity, [
  "id",
  "createdAt",
  "updatedAt",
]) {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsDate()
  @IsNotEmpty()
  dueDate: Date;

  @IsString()
  @IsNotEmpty()
  status: string;
}
