/**
 * haptics.ts
 *
 * WHY: Centralized haptic feedback for all tactile interactions.
 * Works on both web (no-op) and Android (via Capacitor).
 */
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

export async function hapticImpact(style: ImpactStyle.Heavy | ImpactStyle.Medium | ImpactStyle.Light): Promise<void> {
    try {
        await Haptics.impact({ style });
    } catch (error) {
        console.debug('Haptics not available:', error);
    }
}

export async function hapticNotification(type: NotificationType.Success | NotificationType.Warning): Promise<void> {
    try {
        await Haptics.notification({ type });
    } catch (error) {
        console.debug('Haptics not available:', error);
    }
}

export async function hapticSelectionChanged(): Promise<void> {
    try {
        await Haptics.selectionChanged();
    } catch (error) {
        console.debug('Haptics not available:', error);
    }
}

// Presets for common game actions
export const HapticPresets = {
    spellCast: () => hapticImpact(ImpactStyle.Medium),
    damageTaken: () => hapticImpact(ImpactStyle.Heavy),
    healing: () => hapticNotification(NotificationType.Success),
    criticalHit: () => hapticImpact(ImpactStyle.Heavy),
    concentrationBreak: () => hapticNotification(NotificationType.Warning),
    levelUp: () => {
        hapticImpact(ImpactStyle.Light);
        setTimeout(() => hapticImpact(ImpactStyle.Medium), 100);
        setTimeout(() => hapticImpact(ImpactStyle.Heavy), 200);
    },
    buttonPress: () => hapticSelectionChanged(),
};

