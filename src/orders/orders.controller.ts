import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
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
import { OrdersService } from "./orders.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";

// Add these imports at the top
import { DateRangeDto } from "./dto/date-range.dto";
import { AnalyticsResponseDto } from "./dto/analytics-response.dto";

@ApiTags("Orders")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @Roles(UserRole.SERVER, UserRole.MANAGER, UserRole.ADMIN)
  @ApiOperation({ summary: "Create a new order" })
  @ApiResponse({ status: 201, description: "Order created successfully" })
  create(@Body() createOrderDto: CreateOrderDto, @Request() req) {
    return this.ordersService.create(createOrderDto, req.user.id);
  }

  @Get()
  @Roles(UserRole.SERVER, UserRole.MANAGER, UserRole.ADMIN, UserRole.KITCHEN)
  @ApiOperation({ summary: "Get all orders" })
  @ApiResponse({ status: 200, description: "Orders retrieved successfully" })
  findAll() {
    return this.ordersService.findAll();
  }

  @Get("kitchen")
  @Roles(UserRole.KITCHEN, UserRole.MANAGER, UserRole.ADMIN)
  @ApiOperation({ summary: "Get orders for kitchen display" })
  @ApiResponse({
    status: 200,
    description: "Kitchen orders retrieved successfully",
  })
  getKitchenOrders() {
    return this.ordersService.getKitchenOrders();
  }

  @Get(":id")
  @Roles(UserRole.SERVER, UserRole.MANAGER, UserRole.ADMIN, UserRole.KITCHEN)
  @ApiOperation({ summary: "Get order by ID" })
  @ApiResponse({ status: 200, description: "Order retrieved successfully" })
  @ApiResponse({ status: 404, description: "Order not found" })
  findOne(@Param("id") id: string) {
    return this.ordersService.findOne(id);
  }

  @Patch(":id")
  @Roles(UserRole.SERVER, UserRole.MANAGER, UserRole.ADMIN, UserRole.KITCHEN)
  @ApiOperation({ summary: "Update order" })
  @ApiResponse({ status: 200, description: "Order updated successfully" })
  @ApiResponse({ status: 404, description: "Order not found" })
  update(@Param("id") id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(id, updateOrderDto);
  }

  @Delete(":id")
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  @ApiOperation({ summary: "Delete order" })
  @ApiResponse({ status: 200, description: "Order deleted successfully" })
  @ApiResponse({ status: 404, description: "Order not found" })
  remove(@Param("id") id: string) {
    return this.ordersService.remove(id);
  }

  @Post("analytics")
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  @ApiOperation({ summary: "Get analytics data with date range filter" })
  @ApiResponse({
    status: 200,
    description: "Analytics data retrieved successfully",
    type: AnalyticsResponseDto,
  })
  getAnalytics(@Body() dateRange: DateRangeDto) {
    return this.ordersService.getAnalytics(dateRange);
  }
}
