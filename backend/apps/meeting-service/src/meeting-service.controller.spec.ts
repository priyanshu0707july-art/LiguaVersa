import { Test, TestingModule } from '@nestjs/testing';
import { MeetingServiceController } from './meeting-service.controller';
import { MeetingServiceService } from './meeting-service.service';

describe('MeetingServiceController', () => {
  let meetingServiceController: MeetingServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MeetingServiceController],
      providers: [MeetingServiceService],
    }).compile();

    meetingServiceController = app.get<MeetingServiceController>(MeetingServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(meetingServiceController.getHello()).toBe('Hello World!');
    });
  });
});
