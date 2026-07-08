import { Controller, Get } from '@nestjs/common';
import { MeetingServiceService } from './meeting-service.service';

@Controller()
export class MeetingServiceController {
  constructor(private readonly meetingServiceService: MeetingServiceService) {}

  @Get()
  getHello(): string {
    return this.meetingServiceService.getHello();
  }
}
