import { Controller, Sse, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { Observable } from 'rxjs';

// Defines the shape of the data sent in each Server-Sent Event
interface SseEvent {
  data: {
    model: string;
    chunk?: string;
    status?: string;
  };
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  
  @Sse('prompt') // Marks this endpoint as a Server-Sent Events stream at the /prompt route.
  streamPrompt(
    @Query('prompt') prompt: string,
    @Query('sessionId') sessionId: string,
  ): Observable<SseEvent> {
    return this.appService.getAiResponses(prompt, sessionId);
  }
}

