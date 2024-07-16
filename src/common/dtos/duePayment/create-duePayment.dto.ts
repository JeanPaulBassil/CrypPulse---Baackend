import { IsNotEmpty, IsNumber, IsString, IsDate } from "class-validator";
import { Type } from "class-transformer";
import { DuePaymentEntity } from "../../entities/payment.entity";
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
  @Type(() => Date)
  @IsNotEmpty()
  dueDate: Date;

  @IsString()
  @IsNotEmpty()
  status: string;
}
