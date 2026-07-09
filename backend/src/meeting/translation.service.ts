import { Injectable } from '@nestjs/common';

@Injectable()
export class TranslationService {
  async translateText(text: string, targetLang: string = 'es'): Promise<string> {
    const mockDictionary = {
      'hello': '¡Hola!',
      'good morning': '¡Buenos días!',
      'how are you': '¿Cómo estás?',
      'how are you doing': '¿Cómo estás?',
      'thank you': '¡Gracias!',
      'goodbye': '¡Adiós!',
      'yes': 'Sí.',
      'no': 'No.',
      "let's start the meeting": 'Comencemos la reunión.'
    };

    const lower = text.toLowerCase().trim();
    // Simple exact match for demo
    if (mockDictionary[lower]) {
      return mockDictionary[lower];
    }

    // Default fallback mock
    return `[ES] ${text}`;
  }
}
