export type CommandHandler = (args: string[]) => void;

interface VoiceCommand {
  pattern: RegExp;
  handler: CommandHandler;
}

interface SpeechRecognitionEvent {
  results: Array<{ 0: { transcript: string } }>;
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  start: () => void;
  stop: () => void;
}

type SpeechRecognitionConstructor = new () => SpeechRecognition;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

class VoiceCommandService {
  private recognition: SpeechRecognition | null = null;
  private commands: VoiceCommand[] = [];
  private isListening = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognitionImpl = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognitionImpl) {
        this.recognition = new SpeechRecognitionImpl();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-US';
      }
    }
  }

  get supported() {
    return !!this.recognition;
  }

  clearCommands() {
    this.commands = [];
  }

  registerCommand(pattern: RegExp, handler: CommandHandler) {
    this.commands.push({ pattern, handler });
  }

  startListening({ onResult, onEnd, onError }: { onResult?: (transcript: string) => void; onEnd?: () => void; onError?: (message: string) => void } = {}) {
    if (!this.recognition || this.isListening) return false;

    this.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      onResult?.(transcript);
      this.processCommand(transcript);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      onEnd?.();
    };

    this.recognition.onerror = (event) => {
      this.isListening = false;
      onError?.(event.error || 'Voice recognition error');
    };

    this.recognition.start();
    this.isListening = true;
    return true;
  }

  private processCommand(transcript: string) {
    for (const { pattern, handler } of this.commands) {
      const match = transcript.match(pattern);
      if (match) {
        handler(match.slice(1));
        return;
      }
    }
  }

  stopListening() {
    this.recognition?.stop();
    this.isListening = false;
  }
}

export const voiceService = new VoiceCommandService();
