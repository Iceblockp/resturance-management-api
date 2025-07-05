import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  Query,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { UserRole } from "../common/enums/user-role.enum";
import { OrderStatus } from "../common/enums/order-status.enum";
import { KitchenService } from "./kitchen.service";
import { UpdateOrderStatusDto } from "./dto/update-order-status.dto";

@ApiTags("Kitchen")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("kitchen")
export class KitchenController {
  constructor(private readonly kitchenService: KitchenService) {}

  @Get("display")
  @Roles(UserRole.KITCHEN, UserRole.MANAGER, UserRole.ADMIN)
  @ApiOperation({ summary: "Get kitchen display orders" })
  @ApiResponse({
    status: 200,
    description: "Kitchen display orders retrieved successfully",
  })
  getKitchenDisplay() {
    return this.kitchenService.getKitchenDisplay();
  }

  @Get("orders")
  @Roles(UserRole.KITCHEN, UserRole.MANAGER, UserRole.ADMIN)
  @ApiOperation({ summary: "Get orders by status" })
  @ApiResponse({ status: 200, description: "Orders retrieved successfully" })
  getOrdersByStatus(@Query("status") status: OrderStatus) {
    return this.kitchenService.getOrdersByStatus(status);
  }

  @Patch("orders/:id/status")
  @Roles(UserRole.KITCHEN, UserRole.MANAGER, UserRole.ADMIN)
  @ApiOperation({ summary: "Update order status from kitchen" })
  @ApiResponse({
    status: 200,
    description: "Order status updated successfully",
  })
  @ApiResponse({ status: 404, description: "Order not found" })
  updateOrderStatus(
    @Param("id") id: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto
  ) {
    return this.kitchenService.updateOrderStatus(
      id,
      updateOrderStatusDto.status
    );
  }
}
