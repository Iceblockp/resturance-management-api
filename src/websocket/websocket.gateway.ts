import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Logger } from "@nestjs/common";

@WebSocketGateway(8080, {
  cors: {
    origin: "*",
    // credentials: true,
    // methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    // allowedHeaders: ["Content-Type", "Authorization"],
  },
  // transports: ["websocket", "polling"],
})
export class WebsocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger("WebsocketGateway");

  handleConnection(client: Socket) {
    // console.log("client socket is", client.id);
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage("join-kitchen")
  handleJoinKitchen(client: Socket, data: any) {
    client.join("kitchen");
    this.logger.log(`Client ${client.id} joined kitchen room`);
  }

  @SubscribeMessage("leave-kitchen")
  handleLeaveKitchen(client: Socket, data: any) {
    client.leave("kitchen");
    this.logger.log(`Client ${client.id} left kitchen room`);
  }

  emitOrderUpdate(order: any) {
    this.logger.log(`Emitting order update for order ${order.id}`);
    this.server.emit("order-updated", order);
    this.server.to("kitchen").emit("kitchen-order-updated", order);
  }

  emitOrderDeleted(orderId: string) {
    this.server.emit("order-deleted", orderId);
    this.server.to("kitchen").emit("kitchen-order-deleted", orderId);
  }

  emitNewOrder(order: any) {
    this.server.emit("new-order", order);
    this.server.to("kitchen").emit("kitchen-new-order", order);
  }
}
