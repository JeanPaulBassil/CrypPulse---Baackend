import { OmitType, PartialType } from "@nestjs/swagger";
import { DuePaymentEntity } from "src/common/entities/payment.entity";

export class UpdatePaymentDto extends OmitType(PartialType(DuePaymentEntity), [
  "id",
  "createdAt",
  "updatedAt",
]) {}
