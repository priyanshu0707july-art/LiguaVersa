import { Module } from '@nestjs/common';
import { MeetingServiceController } from './meeting-service.controller';
import { MeetingServiceService } from './meeting-service.service';

import { MeetingGateway } from './meeting.gateway';

@Module({
  imports: [],
  controllers: [MeetingServiceController],
  providers: [MeetingServiceService, MeetingGateway],
})
export class MeetingServiceModule {}
