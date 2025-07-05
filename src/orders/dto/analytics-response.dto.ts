import { ApiProperty } from "@nestjs/swagger";

export class TopItemDto {
  @ApiProperty({ example: "Spicy Chicken Burger" })
  name: string;

  @ApiProperty({ example: 42 })
  quantity: number;

  @ApiProperty({ example: 420000 })
  revenue: number;
}

export class CategoryRevenueDto {
  @ApiProperty({ example: "Burgers" })
  category: string;

  @ApiProperty({ example: 750000 })
  revenue: number;
}

export class ServerPerformanceDto {
  @ApiProperty({ example: "John Doe" })
  name: string;

  @ApiProperty({ example: 25 })
  orders: number;

  @ApiProperty({ example: 1250000 })
  revenue: number;
}

export class AnalyticsResponseDto {
  @ApiProperty({ example: 2500000 })
  totalRevenue: number;

  @ApiProperty({ example: 150 })
  totalOrders: number;

  @ApiProperty({ example: 120 })
  completedOrders: number;

  @ApiProperty({ example: 20833.33 })
  averageOrderValue: number;

  @ApiProperty({ example: 15 })
  avgPrepTime: number;

  @ApiProperty({ type: [TopItemDto] })
  topItems: TopItemDto[];

  @ApiProperty({ type: [CategoryRevenueDto] })
  categoryRevenue: CategoryRevenueDto[];

  @ApiProperty({
    type: [Number],
    example: [
      0, 0, 0, 0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 45, 40, 35, 30, 25, 20,
      15, 10, 5, 0,
    ],
  })
  hourlySales: number[];

  @ApiProperty({
    type: [Number],
    example: [
      0, 0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0,
    ],
  })
  hourlyOrders: number[];

  @ApiProperty({ type: [ServerPerformanceDto] })
  topServers: ServerPerformanceDto[];
}
