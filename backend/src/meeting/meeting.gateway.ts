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
  handleOffer(@MessageBody() data: { offer: any, targetUserId: string, callerId: string, roomId: string }, @ConnectedSocket() client: Socket) {
    client.to(data.targetUserId).emit('offer', {
      offer: data.offer,
      callerId: data.callerId
    });
  }

  @SubscribeMessage('answer')
  handleAnswer(@MessageBody() data: { answer: any, targetUserId: string, callerId: string, roomId: string }, @ConnectedSocket() client: Socket) {
    client.to(data.targetUserId).emit('answer', {
      answer: data.answer,
      callerId: data.callerId
    });
  }

  @SubscribeMessage('ice-candidate')
  handleIceCandidate(@MessageBody() data: { candidate: any, targetUserId: string, callerId: string, roomId: string }, @ConnectedSocket() client: Socket) {
    client.to(data.targetUserId).emit('ice-candidate', {
      candidate: data.candidate,
      callerId: data.callerId
    });
  }

  @SubscribeMessage('chat-message')
  handleChatMessage(@MessageBody() data: { message: string, sender: string, roomId: string }, @ConnectedSocket() client: Socket) {
    // Broadcast chat message to everyone in the room except the sender
    client.to(data.roomId).emit('chat-message', {
      message: data.message,
      sender: data.sender,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
  }
}
