import { Injectable } from '@nestjs/common';

@Injectable()
export class MeetingServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}
