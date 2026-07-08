import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { EventEmitter } from 'events';
import { STTService } from './stt.service';
import { TranslationService } from './translation.service';
import { TTSService } from './tts.service';

interface ClientSession {
  socket: Socket;
  sttEmitter: EventEmitter;
  sourceLang: string;
  targetLang: string;
  voiceId: string;
}

@Injectable()
export class PipelineManager {
  private sessions: Map<string, ClientSession> = new Map();

  constructor(
    private sttService: STTService,
    private translationService: TranslationService,
    private ttsService: TTSService,
  ) {}

  initializePipeline(clientId: string, sourceLang: string, targetLang: string, voiceId: string, socket: Socket) {
    const { emitter } = this.sttService.createStream(sourceLang);
    
    this.sessions.set(clientId, {
      socket,
      sttEmitter: emitter,
      sourceLang,
      targetLang,
      voiceId,
    });

    // 1. Listen for STT Results
    emitter.on('transcript', async (data) => {
      if (data.isFinal) {
        console.log(`[Pipeline] Final Transcript: ${data.text}`);
        
        // 2. Stream to Translation Service
        const translatedText = await this.translationService.translateStream(data.text, sourceLang, targetLang);
        
        // Send Subtitles immediately
        socket.emit('subtitles', { text: translatedText, lang: targetLang });

        // 3. Stream to TTS Service
        const ttsEmitter = new EventEmitter();
        this.ttsService.generateSpeechStream(translatedText, voiceId, targetLang, ttsEmitter);
        
        // 4. Send Audio & Visemes back to client for playback and avatar lip-sync
        ttsEmitter.on('tts-audio', (ttsData) => {
          socket.emit('translated-audio', ttsData);
        });
      } else {
        // Send partial subtitles
        socket.emit('partial-subtitles', { text: data.text });
      }
    });
  }

  processAudioChunk(clientId: string, chunk: ArrayBuffer) {
    const session = this.sessions.get(clientId);
    if (session) {
      // Feed chunk to STT stream
      this.sttService.processAudio(session.sttEmitter, chunk);
    }
  }

  terminatePipeline(clientId: string) {
    this.sessions.delete(clientId);
    console.log(`[Pipeline] Terminated pipeline for ${clientId}`);
  }
}
