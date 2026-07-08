import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { MeetingService } from './meeting.service';

@Controller('meetings')
export class MeetingController {
  constructor(private readonly meetingService: MeetingService) {}

  @Post('create')
  async createMeeting(@Body() data: { title: string; description?: string }) {
    return this.meetingService.createMeeting(data);
  }

  @Get('validate/:code')
  async validateCode(@Param('code') code: string) {
    return this.meetingService.validateMeetingCode(code);
  }

  @Post('invite')
  async inviteUser(@Body() data: { meetingCode: string; email: string }) {
    return this.meetingService.inviteUser(data.meetingCode, data.email);
  }
}
