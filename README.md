# nuzha - Intelligent Testing Platform

A microservices-based IQ testing system with JWT authentication, multi-database support, and third-party integrations.

## Tech Stack

- NestJS | GraphQL | PostgreSQL | Docker | Prisma | Google OAuth | Telegram API

## 🌟 Features

- JWT-based authentication system
- Google OAuth 2.0 integration
- Multi-service database architecture
- GraphQL API endpoints
- Email notification system
- Telegram bot integration
- Containerized deployment
- Automated database migrations

## Quick Start

````bash
git clone https://github.com/imransid/nuzha.git && cd nuzha


## 🛠 Tech Stack

- **NestJS** - Backend framework for building efficient and scalable applications.
- **Microservices** - Architecture pattern for decoupling services.
- **PostgreSQL** - Relational database for managing structured data.
- **GraphQL** - API query language for flexible data fetching.
- **Docker** - Containerization for seamless deployment and scalability.

## 📦 Installation & Setup

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/)
- [Docker](https://www.docker.com/)
- [PostgreSQL](https://www.postgresql.org/)

### Clone the Repository

```bash
git clone https://github.com/imransid/nuzha.git
cd nuzha
````

### Environment Variables

Create a `.env` file in your project root with the following configurations:

# Auth Configuration

JWT_SECRET='your_jwt_secret'
GOOGLE_CLIENT_ID='your_google_client_id'
GOOGLE_CLIENT_SECRET='your_google_secret'
GOOGLE_CALLBACK_URL='http://localhost:4000/auth/google/callback'

# Database Configuration

USER_DB_URI=postgresql://user:pass@user-db:5432/user-db
NOTICE_DB_URI=postgresql://user:pass@notice-db:5432/notice-db
PAGE_BUILDER_DB_URI=postgresql://user:pass@page-builder-db:5432/page-builder-db

# Email Service

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS='your_app_password'

# Telegram Integration

TELEGRAM_TOKEN=your_bot_token
TELEGRAM_WEBHOOK_URL=https://your-domain.com/telegram/webhook

# File Storage

UPLOAD_DIR=uploads

### Run Services with Docker

Start the application using Docker Compose:

```bash
docker-compose up --build
```

This will spin up the necessary services, including PostgreSQL and microservices.

### Manual Setup (Without Docker)

If you prefer running the services manually:

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the PostgreSQL database:
   ```bash
   docker run --name nuzha-db -e POSTGRES_USER=user -e POSTGRES_PASSWORD=password -e POSTGRES_DB=nuzha -p 5432:5432 -d postgres
   ```
3. Run the application:
   ```bash
   npm run start:dev
   ```

## 🔍 API Usage

### GraphQL Playground

Once the server is running, access the GraphQL playground at:

```
http://localhost:4099/graphql
```

## 🛠 Development & Contribution

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-branch
   ```
3. Commit your changes and push:
   ```bash
   git push origin feature-branch
   ```
4. Create a Pull Request for review.

docker exec 085bc71c24ab npx prisma generate --schema=./prisma/schema-page-builder.prisma
docker exec 085bc71c24ab npx prisma migrate deploy --schema=./prisma/schema-user.prisma

docker exec 8cba96a2d934 npx prisma generate --schema=./prisma/schema-user.prisma
docker exec 8cba96a2d934 npx prisma db push --force-reset --schema=./prisma/schema-user.prisma

docker exec d1ced19d087a npx prisma generate --schema=./prisma/schema-hr.prisma
docker exec d1ced19d087a npx prisma db push --force-reset --schema=./prisma/schema-hr.prisma

docker exec 5221a459ff7d npx prisma generate --schema=./prisma/schema-page-builder.prisma
docker exec 5221a459ff7d npx prisma db push --force-reset --schema=./prisma/schema-page-builder.prisma

docker exec c2112aecfdb7 npx prisma generate --schema=./prisma/schema-chat.service.prisma
docker exec c2112aecfdb7 npx prisma db push --force-reset --schema=./prisma/schema-chat.service.prisma

npx prisma db push --force-reset --schema=./prisma/schema-chat.service.prisma

sudo docker stop 37566e30ab49 5bea497ccc3d ae24fb48a4e4 51ab77b13e37 0a560d186910
sudo docker rm 37566e30ab49 5bea497ccc3d ae24fb48a4e4 51ab77b13e37 0a560d186910

AAFQEgAAGXTJv4NeP2Wo2YSSQNqPaXh_r0XjlSb_XkXpQg

## 📜 License

This project is licensed under the [MIT License](LICENSE).

<!-- postgresql://postgres:postgres@localhost:5432/real-time-chat?schema=public -->
