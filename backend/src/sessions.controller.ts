import { Controller, Post, Get, Param } from '@nestjs/common';
import { SessionsService } from './sessions.service';

/**
 * This controller defines the routes for session management.
 * It provides two endpoints:
 * 1. POST /sessions: Creates a new, empty session in the database.
 * 2. GET /sessions/:id: Retrieves a specific session along with all of its
 * associated comparison history.
 */
@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post()
  createSession() {
    return this.sessionsService.createSession();
  }

  @Get(':id')
  getSession(@Param('id') id: string) {
    return this.sessionsService.getSession(id);
  }
}

