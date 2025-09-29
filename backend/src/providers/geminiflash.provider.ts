import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { Observable } from 'rxjs';

@Injectable()
export class GeminiFlashProvider {
  private model: GenerativeModel;

  constructor(private configService: ConfigService) {
    const genAI = new GoogleGenerativeAI(
      this.configService.get<string>('GEMINI_API_KEY'),
    );
    this.model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite'  });
  }

  // Generates a response stream from the Gemini model
  generateResponse(prompt: string): Observable<string> {
    return new Observable((subscriber) => {
      const generate = async () => {
        try {
          const result = await this.model.generateContentStream(prompt);
          for await (const chunk of result.stream) {
            subscriber.next(chunk.text());
          }
          subscriber.complete(); // Signal that the stream has finished
        } catch (error) {
          console.error('Gemini Provider Error:', error);
          subscriber.error(error); // Signal an error in the stream
        }
      };
      generate();
    });
  }
}