import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrdersService } from "./orders.service";
import { OrdersController } from "./orders.controller";
import { Order } from "./entities/order.entity";
import { OrderItem } from "./entities/order-item.entity";
import { MenuItem } from "./entities/menu-item.entity";
import { Category } from "./entities/category.entity";
import { WebsocketModule } from "../websocket/websocket.module";
import { MenuItemsController } from "./menu-items.controller";
import { CategoriesController } from "./categories.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, MenuItem, Category]),
    WebsocketModule,
  ],
  controllers: [OrdersController, MenuItemsController, CategoriesController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
