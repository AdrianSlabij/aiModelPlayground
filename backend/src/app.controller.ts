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

  // This endpoint now uses @Sse() which defaults to GET, which is what EventSource uses.
  @Sse('prompt')
  streamPrompt(@Query('prompt') prompt: string): Observable<SseEvent> {
    // We get the prompt from the URL query parameters instead of the request body.
    return this.appService.getAiResponses(prompt);
  }
}

