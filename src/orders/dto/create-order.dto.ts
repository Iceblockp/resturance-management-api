import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsArray,
  ValidateNested,
  Min,
} from "class-validator";
import { Type } from "class-transformer";
import { OrderPriority } from "../../common/enums/order-priority.enum";

export class CreateOrderItemDto {
  @ApiProperty({ example: "menu-item-uuid" })
  @IsString()
  menuItemId: string;

  //id optional
  @ApiProperty({ example: "order-item-uuid", required: false })
  @IsString()
  @IsOptional()
  id?: string;

  @ApiProperty({ example: 2 })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({ example: "No onions, extra cheese", required: false })
  @IsString()
  @IsOptional()
  specialInstructions?: string;

  //price
  @ApiProperty({ example: 100 })
  @IsNumber()
  @Min(0)
  price: number;

  //categoryId
  @ApiProperty({ example: "category-uuid" })
  @IsString()
  categoryId: string;
}

export class CreateOrderDto {
  @ApiProperty({ example: "T-01" })
  @IsString()
  tableNumber: string;

  @ApiProperty({ enum: OrderPriority, example: OrderPriority.NORMAL })
  @IsEnum(OrderPriority)
  @IsOptional()
  priority?: OrderPriority;

  @ApiProperty({ example: "Customer has food allergies", required: false })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ example: 0 })
  @IsNumber()
  @Min(0)
  totalAmount: number;

  @ApiProperty({ type: [CreateOrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  orderItems: CreateOrderItemDto[];
}
