import { useEffect, useState } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { useVoiceCommands } from '../../hooks/useVoiceCommands';

export function VoiceCommandButton() {
  const [isListening, setIsListening] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { startListening, stopListening, isSupported } = useVoiceCommands();

  useEffect(() => {
    return () => {
      stopListening();
    };
  }, [stopListening]);

  const handleClick = () => {
    if (!isSupported) return;

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
    <div className="fixed bottom-24 right-4 z-50 flex flex-col items-end gap-2">
      {errorMessage && (
        <div className="rounded-lg bg-stone-950/90 border border-red-900/50 text-xs text-red-300 px-3 py-2 shadow-xl max-w-[240px]">
          {errorMessage}
        </div>
      )}
      <button
        onClick={handleClick}
        disabled={!isSupported}
        className={`p-4 rounded-full shadow-lg transition-all ${
          isListening ? 'bg-red-500 animate-pulse' : 'bg-accent'
        } ${!isSupported ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
        aria-label={
          !isSupported
            ? 'Voice commands not supported'
            : isListening
            ? 'Stop listening'
            : 'Start voice command'
        }
        data-testid="voice-command-btn"
      >
        {isListening ? <MicOff size={24} /> : <Mic size={24} />}
      </button>
      {!isSupported && (
        <span className="text-[10px] uppercase tracking-widest text-stone-500">Voice unsupported</span>
      )}
    </div>
  );
}
