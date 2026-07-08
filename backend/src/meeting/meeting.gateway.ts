import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class MeetingGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('join-room')
  handleJoinRoom(@MessageBody() data: { roomId: string }, @ConnectedSocket() client: Socket) {
    client.join(data.roomId);
    client.to(data.roomId).emit('user-joined', { userId: client.id });
  }

  @SubscribeMessage('offer')
  handleOffer(@MessageBody() data: { offer: any, roomId: string }, @ConnectedSocket() client: Socket) {
    client.to(data.roomId).emit('offer', data.offer);
  }

  @SubscribeMessage('answer')
  handleAnswer(@MessageBody() data: { answer: any, roomId: string }, @ConnectedSocket() client: Socket) {
    client.to(data.roomId).emit('answer', data.answer);
  }

  @SubscribeMessage('ice-candidate')
  handleIceCandidate(@MessageBody() data: { candidate: any, roomId: string }, @ConnectedSocket() client: Socket) {
    client.to(data.roomId).emit('ice-candidate', data.candidate);
  }
}
