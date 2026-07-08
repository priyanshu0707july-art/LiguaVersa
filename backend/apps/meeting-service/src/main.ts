import { NestFactory } from '@nestjs/core';
import { MeetingServiceModule } from './meeting-service.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  // We use standard Nest application because WebSockets require a full HTTP listener underneath
  const app = await NestFactory.create(MeetingServiceModule);
  app.enableCors();
  
  // It also acts as a microservice listener for events from other services
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: '127.0.0.1',
      port: 3002,
    },
  });

  await app.startAllMicroservices();
  await app.listen(3003); // WebSocket HTTP Server
  console.log(`🎙️ Meeting Microservice (WebSockets/WebRTC Signaling) is listening on port 3003`);
}
bootstrap();
