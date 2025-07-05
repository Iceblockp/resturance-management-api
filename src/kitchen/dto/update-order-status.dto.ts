import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { OrderStatus } from "../../common/enums/order-status.enum";

export class UpdateOrderStatusDto {
  @ApiProperty({ enum: OrderStatus, example: OrderStatus.IN_PROGRESS })
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
