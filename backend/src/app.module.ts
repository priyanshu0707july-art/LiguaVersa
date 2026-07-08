import { Module } from '@nestjs/common';
import { TranslationModule } from './translation/translation.module';
import { MeetingModule } from './meeting/meeting.module';

@Module({
  imports: [TranslationModule, MeetingModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
