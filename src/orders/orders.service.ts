import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Between, Repository } from "typeorm";
import { Order } from "./entities/order.entity";
import { OrderItem } from "./entities/order-item.entity";
import { MenuItem } from "./entities/menu-item.entity";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { OrderStatus } from "../common/enums/order-status.enum";
import { WebsocketGateway } from "../websocket/websocket.gateway";

// Add these imports at the top
import { Category } from "./entities/category.entity";
import { CreateMenuItemDto } from "./dto/create-menu-item.dto";
import { UpdateMenuItemDto } from "./dto/update-menu-item.dto";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { DateRangeDto, DateRangePreset } from "./dto/date-range.dto";
import {
  AnalyticsResponseDto,
  TopItemDto,
  CategoryRevenueDto,
  ServerPerformanceDto,
} from "./dto/analytics-response.dto";

// Add these repository injections in the constructor
@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
    @InjectRepository(MenuItem)
    private menuItemsRepository: Repository<MenuItem>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    private websocketGateway: WebsocketGateway
  ) {}

  async create(createOrderDto: CreateOrderDto, userId: string): Promise<Order> {
    const orderNumber = await this.generateOrderNumber();

    const order = this.ordersRepository.create({
      ...createOrderDto,
      orderNumber,
      createdById: userId,
    });

    const savedOrder = await this.ordersRepository.save(order);

    // Create order items
    // for (const itemDto of createOrderDto.orderItems) {
    //   const menuItem = await this.menuItemsRepository.findOne({
    //     where: { id: itemDto.menuItemId },
    //   });

    //   console.log("menu item full object:", menuItem);
    //   console.log("menu item price:", menuItem?.price);
    //   console.log("menu item price type:", typeof menuItem?.price);

    //   if (!menuItem) {
    //     throw new NotFoundException(
    //       `Menu item with ID ${itemDto.menuItemId} not found`
    //     );
    //   }

    //   // Ensure price is a valid number
    //   const price =
    //     typeof menuItem.price === "string"
    //       ? parseFloat(menuItem.price)
    //       : menuItem.price;

    //   console.log("Processed price:", price);

    //   const orderItem = this.orderItemsRepository.create({
    //     ...itemDto,
    //     orderId: savedOrder.id,
    //     price: price, // Use the processed price
    //     categoryId: menuItem.categoryId,
    //   });

    //   console.log("Created order item:", orderItem);

    //   await this.orderItemsRepository.save(orderItem);
    // }

    const completeOrder = await this.findOne(savedOrder.id);

    // Emit real-time update
    this.websocketGateway.emitNewOrder(completeOrder); // Changed from emitOrderUpdate to emitNewOrder

    return completeOrder;
  }

  async findAll(dateRange?: DateRangeDto): Promise<Order[]> {
    const allOrders = await this.ordersRepository.find({
      relations: [
        "orderItems",
        "orderItems.menuItem",
        "orderItems.category",
        "createdBy",
      ],
      order: { createdAt: "DESC" },
    });

    if (
      dateRange &&
      (dateRange.preset || dateRange.startDate || dateRange.endDate)
    ) {
      return this.filterOrdersByDateRange(allOrders, dateRange);
    }

    return allOrders;
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: [
        "orderItems",
        "orderItems.menuItem",
        "orderItems.category",
        "createdBy",
      ],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async getKitchenOrders(dateRange?: DateRangeDto): Promise<Order[]> {
    const orders = await this.ordersRepository.find({
      where: [{ status: OrderStatus.NEW }, { status: OrderStatus.IN_PROGRESS }],
      relations: [
        "orderItems",
        "orderItems.menuItem",
        "orderItems.category",
        "createdBy",
      ],
      order: { createdAt: "ASC" },
    });

    if (
      dateRange &&
      (dateRange.preset || dateRange.startDate || dateRange.endDate)
    ) {
      return this.filterOrdersByDateRange(orders, dateRange);
    }

    return orders;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(id);

    Object.assign(order, updateOrderDto);

    if (updateOrderDto.status === OrderStatus.READY) {
      order.actualReadyTime = new Date();
    }

    console.log("step one");

    const updatedOrder = await this.ordersRepository.save(order);

    console.log("step two");

    // Emit real-time update
    this.websocketGateway.emitOrderUpdate(updatedOrder);

    return updatedOrder;
  }

  async remove(id: string): Promise<void> {
    const order = await this.findOne(id);
    await this.ordersRepository.remove(order);

    // Emit real-time update
    this.websocketGateway.emitOrderDeleted(id);
  }

  private async generateOrderNumber(): Promise<string> {
    const today = new Date();
    const dateStr = today.toISOString().split("T")[0].replace(/-/g, "");

    // Create start and end dates for today (midnight to midnight)
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    );

    // Count orders created today using Between operator
    const count = await this.ordersRepository.count({
      where: {
        createdAt: Between(startOfDay, endOfDay),
      },
    });

    return `${dateStr}-${(count + 1).toString().padStart(4, "0")}`;
  }

  // Menu Item methods
  async createMenuItem(
    createMenuItemDto: CreateMenuItemDto
  ): Promise<MenuItem> {
    const menuItem = this.menuItemsRepository.create(createMenuItemDto);
    return this.menuItemsRepository.save(menuItem);
  }

  async findAllMenuItems(): Promise<MenuItem[]> {
    return this.menuItemsRepository.find();
  }

  async findOneMenuItem(id: string): Promise<MenuItem> {
    const menuItem = await this.menuItemsRepository.findOne({ where: { id } });
    if (!menuItem) {
      throw new NotFoundException(`Menu item with ID ${id} not found`);
    }
    return menuItem;
  }

  async updateMenuItem(
    id: string,
    updateMenuItemDto: UpdateMenuItemDto
  ): Promise<MenuItem> {
    const menuItem = await this.findOneMenuItem(id);
    const updatedMenuItem = this.menuItemsRepository.merge(
      menuItem,
      updateMenuItemDto
    );
    return this.menuItemsRepository.save(updatedMenuItem);
  }

  async removeMenuItem(id: string): Promise<void> {
    const menuItem = await this.findOneMenuItem(id);
    await this.menuItemsRepository.remove(menuItem);
  }

  // Category methods
  async createCategory(
    createCategoryDto: CreateCategoryDto
  ): Promise<Category> {
    const category = this.categoriesRepository.create(createCategoryDto);
    return this.categoriesRepository.save(category);
  }

  async findAllCategories(): Promise<Category[]> {
    return this.categoriesRepository.find();
  }

  async findOneCategory(id: string): Promise<Category> {
    const category = await this.categoriesRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async updateCategory(
    id: string,
    updateCategoryDto: UpdateCategoryDto
  ): Promise<Category> {
    const category = await this.findOneCategory(id);
    const updatedCategory = this.categoriesRepository.merge(
      category,
      updateCategoryDto
    );
    return this.categoriesRepository.save(updatedCategory);
  }

  async removeCategory(id: string): Promise<void> {
    const category = await this.findOneCategory(id);
    await this.categoriesRepository.remove(category);
  }

  // Rename the existing method to be more generic since we'll use it in multiple places
  private filterOrdersByDateRange(
    orders: Order[],
    dateRange: DateRangeDto
  ): Order[] {
    // If no date range is specified, return all orders
    if (
      !dateRange ||
      (!dateRange.preset && !dateRange.startDate && !dateRange.endDate)
    ) {
      return orders;
    }

    // Calculate date filters based on preset or custom range
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    let startDate: Date;
    let endDate: Date = new Date(now.getTime() + 24 * 60 * 60 * 1000); // Default to tomorrow

    if (dateRange.preset) {
      switch (dateRange.preset) {
        case DateRangePreset.TODAY:
          startDate = today;
          break;
        case DateRangePreset.YESTERDAY:
          startDate = new Date(today.getTime() - 24 * 60 * 60 * 1000);
          endDate = today;
          break;
        case DateRangePreset.WEEK:
          startDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case DateRangePreset.MONTH:
          startDate = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case DateRangePreset.ALL:
        default:
          return orders;
      }
    } else {
      // Use custom date range if provided
      if (dateRange.startDate) {
        startDate = new Date(dateRange.startDate);
      } else {
        // Default to all-time if no start date
        return orders;
      }

      if (dateRange.endDate) {
        endDate = new Date(dateRange.endDate);
      }
    }

    // Filter orders by date range
    return orders.filter(
      (order) => order.createdAt >= startDate && order.createdAt < endDate
    );
  }

  // Update the getAnalytics method to use the new filterOrdersByDateRange method
  async getAnalytics(dateRange: DateRangeDto): Promise<AnalyticsResponseDto> {
    // Get all orders with relations
    const allOrders = await this.ordersRepository.find({
      relations: [
        "orderItems",
        "orderItems.menuItem",
        "orderItems.category",
        "createdBy",
      ],
      order: { createdAt: "DESC" },
    });

    // Get filtered orders based on date range
    const orders = this.filterOrdersByDateRange(allOrders, dateRange);

    // Filter completed orders
    const completedOrders = orders.filter(
      (order) => order.status === OrderStatus.COMPLETED
    );

    // Calculate total revenue
    const totalRevenue = completedOrders.reduce(
      (sum, order) => sum + Number(order.totalAmount),
      0
    );

    // Calculate average order value
    const averageOrderValue =
      completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0;

    // Calculate average preparation time
    const avgPrepTime =
      completedOrders.length > 0
        ? completedOrders.reduce((sum, order) => {
            if (order.actualReadyTime && order.createdAt) {
              const prepTime = Math.floor(
                (order.actualReadyTime.getTime() - order.createdAt.getTime()) /
                  60000
              );
              return sum + prepTime;
            }
            return sum;
          }, 0) / completedOrders.length
        : 0;

    // Calculate top selling items
    const itemSales = new Map<string, TopItemDto>();
    completedOrders.forEach((order) => {
      order.orderItems.forEach((item) => {
        const existing = itemSales.get(item.menuItem.id) || {
          name: item.menuItem.name,
          quantity: 0,
          revenue: 0,
        };
        itemSales.set(item.menuItem.id, {
          name: item.menuItem.name,
          quantity: existing.quantity + item.quantity,
          revenue: existing.revenue + Number(item.price) * item.quantity,
        });
      });
    });

    const topItems = Array.from(itemSales.values())
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    // Calculate revenue by category
    const categoryRevenueMap = new Map<string, number>();
    completedOrders.forEach((order) => {
      order.orderItems.forEach((item) => {
        if (item.category) {
          const existing = categoryRevenueMap.get(item.category.name) || 0;
          categoryRevenueMap.set(
            item.category.name,
            existing + Number(item.price) * item.quantity
          );
        }
      });
    });

    const categoryRevenue: CategoryRevenueDto[] = Array.from(
      categoryRevenueMap.entries()
    )
      .map(([category, revenue]) => ({ category, revenue }))
      .sort((a, b) => b.revenue - a.revenue);

    // Calculate hourly sales data
    const hourlySales = new Array(24).fill(0);
    const hourlyOrders = new Array(24).fill(0);
    completedOrders.forEach((order) => {
      const hour = order.createdAt.getHours();
      hourlySales[hour] += Number(order.totalAmount);
      hourlyOrders[hour] += 1;
    });

    // Calculate server performance
    const serverStats = new Map<
      string,
      { name: string; orders: number; revenue: number }
    >();
    completedOrders.forEach((order) => {
      if (order.createdBy) {
        const existing = serverStats.get(order.createdBy.id) || {
          name: order.createdBy.name,
          orders: 0,
          revenue: 0,
        };
        serverStats.set(order.createdBy.id, {
          name: order.createdBy.name,
          orders: existing.orders + 1,
          revenue: existing.revenue + Number(order.totalAmount),
        });
      }
    });

    const topServers = Array.from(serverStats.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    return {
      totalRevenue,
      totalOrders: orders.length,
      completedOrders: completedOrders.length,
      averageOrderValue,
      avgPrepTime,
      topItems,
      categoryRevenue,
      hourlySales,
      hourlyOrders,
      topServers,
    };
  }

  // Remove the old getFilteredOrdersByDateRange method as it's replaced by filterOrdersByDateRange
}
