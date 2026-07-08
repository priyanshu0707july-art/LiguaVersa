import { Module } from '@nestjs/common';
import { TranslationModule } from './translation/translation.module';
import { MeetingModule } from './meeting/meeting.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, TranslationModule, MeetingModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
