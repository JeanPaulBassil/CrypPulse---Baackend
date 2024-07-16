import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { DuePaymentService } from "./duePayment.service";
import { CreatePaymentDto } from "src/common/dtos/duePayment/create-duePayment.dto";
import { UpdatePaymentDto } from "src/common/dtos/duePayment/update-duePayment.dto";
import { FilterPaymentsDto } from "src/common/dtos/duePayment/filter-duePayment.dto";
import { PageOptionsDto, PaginatedResponseDto } from "src/common/dtos";
import { DuePaymentEntity } from "src/common/entities/payment.entity";

@Controller("duePayments")
export class DuePaymentController {
  constructor(private readonly duePaymentService: DuePaymentService) {}

  @Post()
  async create(
    @Body() createPaymentDto: CreatePaymentDto,
  ): Promise<DuePaymentEntity> {
    try {
      return await this.duePaymentService.create(createPaymentDto);
    } catch (error) {
      throw new HttpException(
        "Error creating payment",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async findAll(
    @Query() filterPaymentsDto: FilterPaymentsDto,
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PaginatedResponseDto<DuePaymentEntity>> {
    return await this.duePaymentService.findAll(
      filterPaymentsDto,
      pageOptionsDto,
    );
  }

  @Get(":id")
  async findOne(@Param("id") id: string): Promise<DuePaymentEntity> {
    return await this.duePaymentService.findOne(id);
  }

  @Put(":id")
  async update(
    @Param("id") id: string,
    @Body() updatePaymentDto: UpdatePaymentDto,
  ): Promise<DuePaymentEntity> {
    try {
      return await this.duePaymentService.update(id, updatePaymentDto);
    } catch (error) {
      throw new HttpException(
        "Error updating payment",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(":id")
  async remove(@Param("id") id: string): Promise<DuePaymentEntity> {
    try {
      return await this.duePaymentService.remove(id);
    } catch (error) {
      if (error.status === 404) {
        throw new HttpException("Payment not found", HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        "Error deleting payment",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get("total/monthly")
  async getTotalMonthlyDue(): Promise<number> {
    try {
      const start = new Date();
      start.setDate(1);

      const end = new Date();
      end.setMonth(end.getMonth() + 1);
      end.setDate(0);

      return await this.duePaymentService.getTotalDue({
        start,
        end,
      });
    } catch (error) {
      throw new HttpException(
        "Error fetching total monthly due",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get("total/weekly")
  async getTotalWeeklyDue(): Promise<number> {
    try {
      const start = new Date();
      start.setDate(start.getDate() - start.getDay() + 1);

      const end = new Date();
      end.setDate(end.getDate() - end.getDay() + 7);

      return await this.duePaymentService.getTotalDue({
        start,
        end,
      });
    } catch (error) {
      throw new HttpException(
        "Error fetching total weekly due",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get("total/daily")
  async getTotalDailyDue(): Promise<number> {
    try {
      return await this.duePaymentService.getTotalDue({
        start: new Date(),
        end: new Date(),
      });
    } catch (error) {
      throw new HttpException(
        "Error fetching total daily due",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
