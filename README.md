# Kitchen Display System (KDS) API

A comprehensive NestJS API for Order Management & Kitchen Display System that streamlines order flow from server to kitchen with real-time updates.

## 🚀 Features

- **User Management** with role-based access control (Admin, Manager, Kitchen Staff, Server)
- **Order Management** with real-time status updates
- **Kitchen Display System** with color-coded order status
- **Real-time WebSocket** communication for live updates
- **JWT Authentication** and authorization
- **PostgreSQL** database with TypeORM
- **Comprehensive API Documentation** with Swagger
- **Production-ready** architecture with proper error handling

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn package manager

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd kitchen-display-system-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Copy the `.env.example` file to `.env` and configure your environment variables:
   ```bash
   cp .env.example .env
   ```

4. **Database Setup**
   - Create a PostgreSQL database
   - Update the database configuration in `.env`

5. **Run the application**
   ```bash
   # Development
   npm run start:dev

   # Production
   npm run build
   npm run start:prod
   ```

## 🔑 Environment Variables

```env
# Database Configuration
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=password
DATABASE_NAME=kds_db

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRATION=24h

# Application Configuration
PORT=3000
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:3001
```

## 📊 Database Schema

### Users Table
- `id` (UUID, Primary Key)
- `email` (Unique)
- `firstName`
- `lastName`
- `password` (Hashed)
- `role` (Enum: admin, manager, kitchen_staff, server)
- `isActive` (Boolean)
- `createdAt`, `updatedAt`

### Orders Table
- `id` (UUID, Primary Key)
- `orderNumber` (Generated)
- `tableNumber`
- `status` (Enum: pending, confirmed, preparing, ready, served, cancelled)
- `priority` (Enum: low, normal, high, urgent)
- `totalAmount`
- `notes`
- `estimatedReadyTime`, `actualReadyTime`
- `createdById` (Foreign Key to Users)
- `createdAt`, `updatedAt`

### Order Items Table
- `id` (UUID, Primary Key)
- `orderId` (Foreign Key to Orders)
- `menuItemId` (Foreign Key to Menu Items)
- `quantity`
- `price`
- `specialInstructions`

### Menu Items Table
- `id` (UUID, Primary Key)
- `name`
- `description`
- `price`
- `category`
- `isAvailable`
- `preparationTime`
- `createdAt`, `updatedAt`

## 🎯 API Endpoints

### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration

### Users
- `GET /api/v1/users` - Get all users (Admin/Manager)
- `GET /api/v1/users/:id` - Get user by ID
- `POST /api/v1/users` - Create user (Admin only)
- `PATCH /api/v1/users/:id` - Update user (Admin only)
- `DELETE /api/v1/users/:id` - Delete user (Admin only)

### Orders
- `GET /api/v1/orders` - Get all orders
- `GET /api/v1/orders/:id` - Get order by ID
- `POST /api/v1/orders` - Create new order
- `PATCH /api/v1/orders/:id` - Update order
- `DELETE /api/v1/orders/:id` - Delete order (Manager/Admin)
- `GET /api/v1/orders/kitchen` - Get kitchen display orders

### Kitchen
- `GET /api/v1/kitchen/display` - Get kitchen display orders
- `GET /api/v1/kitchen/orders?status=preparing` - Get orders by status
- `PATCH /api/v1/kitchen/orders/:id/status` - Update order status

## 🔐 User Roles & Permissions

### Admin
- Full system access
- User management
- Order management
- System configuration

### Manager
- View all users
- Order management
- Kitchen operations
- Reports and analytics

### Kitchen Staff
- View kitchen orders
- Update order status
- Kitchen display access

### Server
- Create orders
- View assigned orders
- Update order details

## 🔄 Real-time Features

The system uses WebSocket for real-time communication:

### WebSocket Events
- `order-updated` - Order status changed
- `order-deleted` - Order removed
- `new-order` - New order created
- `kitchen-order-updated` - Kitchen-specific order updates
- `kitchen-new-order` - New order for kitchen

### Kitchen Display Integration
- Color-coded order status
- Real-time order updates
- Priority-based ordering
- Estimated preparation times

## 🎨 Order Status Colors

- **Pending** - Gray (#6B7280)
- **Confirmed** - Blue (#3B82F6)
- **Preparing** - Orange (#F59E0B)
- **Ready** - Green (#10B981)
- **Served** - Success (#059669)
- **Cancelled** - Red (#EF4444)

## 📖 API Documentation

Access the interactive API documentation at:
```
http://localhost:3000/api/docs
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# Test coverage
npm run test:cov

# End-to-end tests
npm run test:e2e
```

## 🚀 Production Deployment

1. **Environment Setup**
   - Set `NODE_ENV=production`
   - Configure production database
   - Set secure JWT secrets

2. **Build Application**
   ```bash
   npm run build
   ```

3. **Start Production Server**
   ```bash
   npm run start:prod
   ```

## 🔧 Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Type safety
- **Jest** - Testing framework

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the API documentation

---

**Built with NestJS, TypeORM, PostgreSQL, and WebSocket for real-time kitchen operations.**