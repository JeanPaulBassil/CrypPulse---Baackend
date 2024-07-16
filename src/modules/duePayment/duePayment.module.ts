import { Module } from "@nestjs/common";
import { DuePaymentService } from "./duePayment.service";
import { DuePaymentController } from "./duePayment.controller";
import { PrismaService } from "nestjs-prisma";

@Module({
  imports: [],
  controllers: [DuePaymentController],
  providers: [DuePaymentService, PrismaService],
  exports: [DuePaymentService],
})
export class DuePaymentModule {}
