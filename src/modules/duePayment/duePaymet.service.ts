import { HttpException, Injectable } from "@nestjs/common";
import { CreatePaymentDto } from "src/common/dtos/duePayment/create-duePayment.dto";
import { UpdatePaymentDto } from "src/common/dtos/duePayment/update-duePayment.dto";
import { PrismaService } from "nestjs-prisma";
import { DuePaymentEntity } from "src/common/entities/payment.entity";
import { FilterPaymentsDto } from "src/common/dtos/duePayment/filter-duePayment.dto";
import { Prisma } from "@prisma/client";
import {
  PageMetaDto,
  PageOptionsDto,
  PaginatedResponseDto,
} from "src/common/dtos";

@Injectable()
export class DuePaymentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPaymentDto: CreatePaymentDto): Promise<DuePaymentEntity> {
    try {
      return await this.prisma.duePayment.create({
        data: createPaymentDto,
      });
    } catch (error) {
      console.log(error);
      throw new HttpException("Error creating payment", 500);
    }
  }

  async findAll(
    filterPaymentsDto: FilterPaymentsDto,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PaginatedResponseDto<DuePaymentEntity>> {
    const { status, dueInDays, title } = filterPaymentsDto;

    const where: Prisma.DuePaymentWhereInput = {
      status: status || undefined,
      dueDate: dueInDays
        ? {
            lte: new Date(new Date().setDate(new Date().getDate() + dueInDays)),
          }
        : undefined,
      title: title ? { contains: title, mode: "insensitive" } : undefined,
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.duePayment.findMany({
        skip: pageOptionsDto.skip,
        take: pageOptionsDto.take,
        where,
        orderBy: { createdAt: pageOptionsDto.order },
      }),
      this.prisma.duePayment.count({ where }),
    ]);

    const pageMetaDto = new PageMetaDto({
      pageOptionsDto,
      itemCount: total,
    });

    return new PaginatedResponseDto<DuePaymentEntity>(items, pageMetaDto);
  }

  async findOne(id: string): Promise<DuePaymentEntity> {
    return await this.prisma.duePayment.findUnique({
      where: { id },
    });
  }

  async update(
    id: string,
    updatePaymentDto: UpdatePaymentDto,
  ): Promise<DuePaymentEntity> {
    try {
      return await this.prisma.duePayment.update({
        where: { id },
        data: updatePaymentDto,
      });
    } catch (error) {
      console.log(error);
      throw new HttpException("Error updating payment", 500);
    }
  }

  async remove(id: string): Promise<DuePaymentEntity> {
    try {
      return await this.prisma.duePayment.delete({
        where: { id },
      });
    } catch (error) {
      console.log(error);
      throw new HttpException("Error deleting payment", 500);
    }
  }

  async getTotalDue(dateRange: { start: Date; end: Date }): Promise<number> {
    const { start, end } = dateRange;
    const payments = await this.prisma.duePayment.findMany({
      where: {
        dueDate: {
          gte: start,
          lte: end,
        },
      },
    });

    return payments.reduce((total, payment) => total + payment.amount, 0);
  }
}
