import { Injectable } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma";

@Injectable()
export class DuePaymentService {
  constructor(private prisma: PrismaService) {}
}
