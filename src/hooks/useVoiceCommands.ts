import { useCallback, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { voiceService } from '../services/voiceCommandService';
import {
  hpChanged,
  concentrationSet,
  longRestHealth,
} from '../store/slices/healthSlice';
import {
  longRestWarlock,
  shortRestWarlock
} from '../store/slices/warlockSlice';
import { selectCharacter } from '../store/selectors';

export function useVoiceCommands() {
  const dispatch = useAppDispatch();
  const character = useAppSelector(selectCharacter);
  const characterRef = useRef(character);

  useEffect(() => {
    characterRef.current = character;
  }, [character]);

  useEffect(() => {
    voiceService.clearCommands();

    voiceService.registerCommand(/long rest/, () => {
      dispatch(longRestHealth());
      dispatch(longRestWarlock());
    });

    voiceService.registerCommand(/short rest/, () => {
      dispatch(shortRestWarlock());
    });

    voiceService.registerCommand(/take (\d+) damage/, ([amount]) => {
      const damage = Number.parseInt(amount, 10);
      dispatch(hpChanged(Math.max(characterRef.current.hp.current - damage, 0)));
    });

    voiceService.registerCommand(/heal (\d+)/, ([amount]) => {
      const healing = Number.parseInt(amount, 10);
      dispatch(
        hpChanged(
          Math.min(characterRef.current.hp.current + healing, characterRef.current.hp.max)
        )
      );
    });

    voiceService.registerCommand(/cast (.+)/, ([spellName]) => {
      dispatch(concentrationSet(spellName));
    });
  }, [dispatch]);

  const startListening = useCallback((onEnd?: () => void, onError?: (message: string) => void) => {
    return voiceService.startListening({ onEnd, onError });
  }, []);

  const stopListening = useCallback(() => {
    voiceService.stopListening();
  }, []);

  return {
    startListening,
    stopListening,
    isSupported: voiceService.supported,
  };
}
