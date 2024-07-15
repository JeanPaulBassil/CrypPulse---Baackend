import { DuePayment } from "@prisma/client";

export class DuePaymentEntity implements DuePayment {
  id: string;
  title: string;
  amount: number;
  dueDate: Date;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
