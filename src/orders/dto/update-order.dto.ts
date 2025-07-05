import { ApiProperty } from "@nestjs/swagger";
import {
  IsEnum,
  IsOptional,
  IsString,
  IsDateString,
  IsNumber,
  IsArray,
  ValidateNested,
  Min,
} from "class-validator";
import { Type } from "class-transformer";
import { OrderStatus } from "../../common/enums/order-status.enum";
import { OrderPriority } from "../../common/enums/order-priority.enum";
import { CreateOrderItemDto } from "./create-order.dto";

export class UpdateOrderDto {
  @ApiProperty({ enum: OrderStatus, example: OrderStatus.IN_PROGRESS })
  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;

  @ApiProperty({ enum: OrderPriority, example: OrderPriority.HIGH })
  @IsEnum(OrderPriority)
  @IsOptional()
  priority?: OrderPriority;

  @ApiProperty({ example: "Updated notes", required: false })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ example: "2024-01-01T12:00:00Z", required: false })
  @IsDateString()
  @IsOptional()
  estimatedReadyTime?: Date;

  @ApiProperty({ example: "T-01", required: false })
  @IsString()
  @IsOptional()
  tableNumber?: string;

  @ApiProperty({ example: 0, required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  totalAmount?: number;

  @ApiProperty({ type: [CreateOrderItemDto], required: false })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  @IsOptional()
  orderItems?: CreateOrderItemDto[];
}
