import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GeminiProProvider } from './providers/geminipro.provider';
import { GeminiFlashProvider } from './providers/geminiflash.provider';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [AppController],
  providers: [AppService, GeminiProProvider, GeminiFlashProvider],
})
export class AppModule {}