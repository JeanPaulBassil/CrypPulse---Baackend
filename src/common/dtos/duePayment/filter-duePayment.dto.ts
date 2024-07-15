import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, IsNumber } from "class-validator";

export class FilterPaymentsDto {
  @ApiPropertyOptional({ description: "Page number for pagination" })
  @IsNumber()
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({ description: "Offset for pagination" })
  @IsNumber()
  @IsOptional()
  offset?: number;

  @ApiPropertyOptional({ description: "Filter by status" })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({ description: "Due in the following x days" })
  @IsNumber()
  @IsOptional()
  dueInDays?: number;

  @ApiPropertyOptional({ description: "Search by title" })
  @IsString()
  @IsOptional()
  title?: string;
}
