import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
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
import { CreateMenuItemDto } from "./dto/create-menu-item.dto";
import { UpdateMenuItemDto } from "./dto/update-menu-item.dto";

@ApiTags("Menu Items")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("menu-items")
export class MenuItemsController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  @ApiOperation({ summary: "Create a new menu item" })
  @ApiResponse({ status: 201, description: "Menu item created successfully" })
  createMenuItem(@Body() createMenuItemDto: CreateMenuItemDto) {
    return this.ordersService.createMenuItem(createMenuItemDto);
  }

  @Get()
  @ApiOperation({ summary: "Get all menu items" })
  @ApiResponse({
    status: 200,
    description: "Menu items retrieved successfully",
  })
  findAllMenuItems() {
    return this.ordersService.findAllMenuItems();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get menu item by ID" })
  @ApiResponse({ status: 200, description: "Menu item retrieved successfully" })
  @ApiResponse({ status: 404, description: "Menu item not found" })
  findOneMenuItem(@Param("id") id: string) {
    return this.ordersService.findOneMenuItem(id);
  }

  @Patch(":id")
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  @ApiOperation({ summary: "Update menu item" })
  @ApiResponse({ status: 200, description: "Menu item updated successfully" })
  @ApiResponse({ status: 404, description: "Menu item not found" })
  updateMenuItem(
    @Param("id") id: string,
    @Body() updateMenuItemDto: UpdateMenuItemDto
  ) {
    return this.ordersService.updateMenuItem(id, updateMenuItemDto);
  }

  @Delete(":id")
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  @ApiOperation({ summary: "Delete menu item" })
  @ApiResponse({ status: 200, description: "Menu item deleted successfully" })
  @ApiResponse({ status: 404, description: "Menu item not found" })
  removeMenuItem(@Param("id") id: string) {
    return this.ordersService.removeMenuItem(id);
  }
}
