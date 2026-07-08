import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PipelineManager } from './pipeline.manager';

@WebSocketGateway({ cors: { origin: '*' }, namespace: '/ai-stream' })
export class AudioStreamGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(private readonly pipelineManager: PipelineManager) {}

  handleConnection(client: Socket) {
    console.log(`[AI Stream] Client connected: ${client.id}`);
  }

  @SubscribeMessage('start-stream')
  handleStartStream(client: Socket, payload: { sourceLang: string, targetLang: string, voiceId: string }) {
    console.log(`Starting stream for ${client.id}. ${payload.sourceLang} -> ${payload.targetLang}`);
    this.pipelineManager.initializePipeline(client.id, payload.sourceLang, payload.targetLang, payload.voiceId, client);
  }

  @SubscribeMessage('audio-chunk')
  handleAudioChunk(client: Socket, payload: { chunk: ArrayBuffer }) {
    // Pipe incoming raw audio buffer into the STT service pipeline
    this.pipelineManager.processAudioChunk(client.id, payload.chunk);
  }

  @SubscribeMessage('stop-stream')
  handleStopStream(client: Socket) {
    this.pipelineManager.terminatePipeline(client.id);
  }
}
