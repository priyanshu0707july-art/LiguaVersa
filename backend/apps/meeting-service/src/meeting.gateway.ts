import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MeetingGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(client: Socket, payload: { roomId: string; userId: string }) {
    client.join(payload.roomId);
    client.to(payload.roomId).emit('user-joined', { userId: payload.userId, socketId: client.id });
    return { event: 'joined', data: { roomId: payload.roomId } };
  }

  // WebRTC Signaling: Offer
  @SubscribeMessage('webrtc-offer')
  handleOffer(client: Socket, payload: { targetSocketId: string; sdp: any }) {
    client.to(payload.targetSocketId).emit('webrtc-offer', {
      senderId: client.id,
      sdp: payload.sdp,
    });
  }

  // WebRTC Signaling: Answer
  @SubscribeMessage('webrtc-answer')
  handleAnswer(client: Socket, payload: { targetSocketId: string; sdp: any }) {
    client.to(payload.targetSocketId).emit('webrtc-answer', {
      senderId: client.id,
      sdp: payload.sdp,
    });
  }

  // WebRTC Signaling: ICE Candidate
  @SubscribeMessage('webrtc-ice-candidate')
  handleIceCandidate(client: Socket, payload: { targetSocketId: string; candidate: any }) {
    client.to(payload.targetSocketId).emit('webrtc-ice-candidate', {
      senderId: client.id,
      candidate: payload.candidate,
    });
  }
}
