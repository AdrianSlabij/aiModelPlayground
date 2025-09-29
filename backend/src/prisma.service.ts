import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * This service extends the PrismaClient and handles the database connection.
 * By using NestJS's OnModuleInit lifecycle hook, it ensures that a connection
 * is established as soon as the application module is initialized.
 * This service is then injected into other services that need to perform
 * database operations.
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}

