import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/**
 * This service contains the business logic for session-related database operations.
 * It uses the PrismaService to interact with the database.
 */
@Injectable()
export class SessionsService {
  constructor(private prisma: PrismaService) {}


  async createSession() {
    return this.prisma.session.create({
      data: {}, // No initial data is needed for a new session.
    });
  }


  async getSession(id: string) {
    return this.prisma.session.findUnique({
      where: { id },
      include: {
        // Eagerly load the related comparisons for this session.
        comparisons: {
          orderBy: { createdAt: 'asc' }, // Order them by creation time.
          include: {
            // For each comparison, also load its responses.
            responses: true,
          },
        },
      },
    });
  }
}

