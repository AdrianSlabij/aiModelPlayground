import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GeminiFlashProvider } from './providers/geminiflash.provider';
import { GeminiProProvider } from './providers/geminipro.provider';
import { PrismaService } from './prisma.service';
import { SessionsController } from './sessions.controller';
import { SessionsService } from './sessions.service';


@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  // All controllers used in the application must be listed here.
  controllers: [AppController, SessionsController],
  // All providers (services) are listed here so they can be injected elsewhere.
  providers: [
    AppService,
    GeminiFlashProvider,
    GeminiProProvider,
    PrismaService,
    SessionsService,
  ],
})
export class AppModule {}

