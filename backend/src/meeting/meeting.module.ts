import { Module } from '@nestjs/common';
import { MeetingGateway } from './meeting.gateway';
import { MeetingController } from './meeting.controller';
import { MeetingService } from './meeting.service';

@Module({
  controllers: [MeetingController],
  providers: [MeetingGateway, MeetingService],
})
export class MeetingModule {}
