import { Injectable } from '@nestjs/common';
import { OrdersService } from '../orders/orders.service';
import { Order } from '../orders/entities/order.entity';
import { OrderStatus } from '../common/enums/order-status.enum';

@Injectable()
export class KitchenService {
  constructor(private ordersService: OrdersService) {}

  async getKitchenDisplay(): Promise<Order[]> {
    return this.ordersService.getKitchenOrders();
  }

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
    return this.ordersService.update(orderId, { status });
  }

  async getOrdersByStatus(status: OrderStatus): Promise<Order[]> {
    const allOrders = await this.ordersService.findAll();
    return allOrders.filter(order => order.status === status);
  }
}