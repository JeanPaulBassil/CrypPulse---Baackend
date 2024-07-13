import { ApiProperty } from "@nestjs/swagger";
import { DuePayment } from "@prisma/client";

export class PaymentEntity implements DuePayment {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  paymentDate: Date;

  @ApiProperty()
  dueDate: Date;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
