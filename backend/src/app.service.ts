import { Injectable } from '@nestjs/common';
import { merge, Observable, map, concat, of } from 'rxjs';
import { GeminiFlashProvider } from './providers/geminiflash.provider';
import { GeminiProProvider } from './providers/geminipro.provider';

@Injectable()
export class AppService {
  constructor(
    private readonly geminiFlashProvider: GeminiFlashProvider,
    private readonly geminiProProvider: GeminiProProvider,
  ) {}

  getAiResponses(prompt: string): Observable<any> {
    const geminiFlashStream = this.geminiFlashProvider.generateResponse(prompt);
    const geminiProStream = this.geminiProProvider.generateResponse(prompt);

    const geminiFlashEventStream = geminiFlashStream.pipe(
      map((textChunk) => ({
        data: { model: 'gemini-flash', chunk: textChunk },
      })),
    );

    const geminiProEventStream = geminiProStream.pipe(
      map((textChunk) => ({
        data: { model: 'gemini-pro', chunk: textChunk },
      })),
    );
    
    // Creates a special event to signal that both streams are complete
    const doneEvent = of({ data: { model: 'system', status: 'done' } });

    // Merges the two model streams to run in parallel, and then appends the 'done' event at the very end
    return concat(merge(geminiFlashEventStream, geminiProEventStream), doneEvent);
  }
}

