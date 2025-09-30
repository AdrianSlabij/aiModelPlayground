import { Injectable } from '@nestjs/common';
import { merge, Observable, map, tap } from 'rxjs';
import { GeminiFlashProvider } from './providers/geminiflash.provider';
import { GeminiProProvider } from './providers/geminipro.provider';
import { PrismaService } from './prisma.service';

// Defines the shape of the data sent in each Server-Sent Event
interface SseEvent {
  data: {
    model: string;
    chunk?: string;
    status?: string;
  };
}

@Injectable()
export class AppService {
  constructor(
    private readonly geminiProvider: GeminiFlashProvider,
    private readonly geminiProProvider: GeminiProProvider,
    private readonly prisma: PrismaService,
  ) {}


  getAiResponses(prompt: string, sessionId: string): Observable<SseEvent> {
    // An object to hold the full response text for saving to the database.
    const fullResponses = {
      'gemini-flash': '',
      'gemini-pro': '',
    };

    // Create a stream for the Gemini Flash model.
    const geminiFlashEventStream = this.geminiProvider.generateResponse(prompt).pipe(
      // Use tap to "spy" on the stream and collect the chunks as they pass through.
      tap((chunk) => (fullResponses['gemini-flash'] += chunk)),
      // Map the raw text chunk into the standard event format for the frontend.
      map((textChunk) => ({
        data: { model: 'gemini-flash', chunk: textChunk },
      })),
    );

    // Create a stream for the Gemini Pro model.
    const geminiProEventStream = this.geminiProProvider.generateResponse(prompt).pipe(
      tap((chunk) => (fullResponses['gemini-pro'] += chunk)),
      map((textChunk) => ({
        data: { model: 'gemini-pro', chunk: textChunk },
      })),
    );

    // Merge both model streams into a single stream.
    const allStreams$ = merge(geminiFlashEventStream, geminiProEventStream);

    // Return a new observable that wraps the merged stream.
    return new Observable<SseEvent>((subscriber) => {
      allStreams$.subscribe({
        // Pass every data event directly to the client.
        next: (event) => subscriber.next(event),
        // Pass any errors to the client.
        error: (err) => subscriber.error(err),
        // This function runs when both source streams have completed.
        complete: async () => {
          try {
            // Save the complete conversation to the database.
            await this.prisma.comparison.create({
              data: {
                prompt,
                sessionId,
                responses: {
                  create: [
                    { model: 'gemini-flash', content: fullResponses['gemini-flash'] },
                    { model: 'gemini-pro', content: fullResponses['gemini-pro'] },
                  ],
                },
              },
            });
            console.log(`Comparison saved for session ${sessionId}`);
          } catch (error) {
            console.error('Failed to save comparison to database', error);
          } finally {
            // Send a final "done" message to let the client know the stream is over.
            subscriber.next({ data: { model: 'system', status: 'done' } });
            // Close the connection.
            subscriber.complete();
          }
        },
      });
    });
  }
}

