import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { OrdersModule } from "./orders/orders.module";
import { KitchenModule } from "./kitchen/kitchen.module";
import { WebsocketModule } from "./websocket/websocket.module";
import { DatabaseModule } from "./database/database.module";
import { UploadController } from "./common/controllers/upload.controller";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    OrdersModule,
    KitchenModule,
    WebsocketModule,
  ],
  controllers: [UploadController],
  providers: [],
})
export class AppModule {}
