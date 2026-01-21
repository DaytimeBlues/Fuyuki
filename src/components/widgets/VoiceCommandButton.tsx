import { useEffect, useState } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { useVoiceCommands } from '../../hooks/useVoiceCommands';
import { useDraggableWidget } from '../../hooks/useDraggableWidget';

export function VoiceCommandButton() {
  const [isListening, setIsListening] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { startListening, stopListening, isSupported } = useVoiceCommands();
  const { isDragging, bind } = useDraggableWidget({ id: 'voice' });

  useEffect(() => {
    return () => {
      stopListening();
    };
  }, [stopListening]);

  const handleClick = () => {
    if (!isSupported || isDragging) return;

    if (isListening) {
      stopListening();
      setIsListening(false);
      return;
    }

    const started = startListening(
      () => setIsListening(false),
      (message) => {
        setErrorMessage(message);
        setIsListening(false);
      }
    );

    if (started) {
      setErrorMessage(null);
      setIsListening(true);
    }
  };

  return (
    <div
      {...bind}
      className="flex flex-col items-end gap-2 pointer-events-auto"
    >
      {errorMessage && (
        <div className="rounded-lg bg-stone-950/90 border border-red-900/50 text-xs text-red-300 px-3 py-2 shadow-xl max-w-[240px]">
          {errorMessage}
        </div>
      )}
      <button
        onClick={handleClick}
        disabled={!isSupported}
        className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl transition-all
          bg-black/40 backdrop-blur-xl border border-white/10
          ${isListening ? 'bg-red-500/80 animate-pulse ring-2 ring-red-400/50' : 'hover:scale-105'}
          ${!isSupported ? 'opacity-50 cursor-not-allowed' : ''}
          ${isDragging ? 'scale-110 shadow-2xl shadow-accent/30 ring-2 ring-accent/50' : ''}
        `}
        aria-label={
          !isSupported
            ? 'Voice commands not supported'
            : isListening
              ? 'Stop listening'
              : 'Start voice command'
        }
        data-testid="voice-command-btn"
      >
        {isListening ? <MicOff size={24} className="text-white" /> : <Mic size={24} className="text-accent" />}
      </button>
      {!isSupported && (
        <span className="text-[10px] uppercase tracking-widest text-stone-500">Voice unsupported</span>
      )}
    </div>
  );
}
