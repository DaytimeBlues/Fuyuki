/**
 * haptics.ts
 *
 * WHY: Centralized haptic feedback for all tactile interactions.
 * Uses the Web Vibration API for browser support, fallback to no-op.
 */

// Haptic style intensities mapped to vibration durations (ms)
export const ImpactStyle = {
    Light: 'Light',
    Medium: 'Medium',
    Heavy: 'Heavy',
} as const;

export const NotificationType = {
    Success: 'Success',
    Warning: 'Warning',
} as const;

type ImpactStyleType = (typeof ImpactStyle)[keyof typeof ImpactStyle];
type NotificationTypeType = (typeof NotificationType)[keyof typeof NotificationType];

const VIBRATION_DURATIONS: Record<ImpactStyleType, number> = {
    Light: 10,
    Medium: 25,
    Heavy: 50,
};

const NOTIFICATION_PATTERNS: Record<NotificationTypeType, number[]> = {
    Success: [20, 50, 20],
    Warning: [50, 30, 50],
};

function vibrate(pattern: number | number[]): void {
    try {
        if ('vibrate' in navigator) {
            navigator.vibrate(pattern);
        }
    } catch {
        // Vibration API not available or blocked
    }
}

export async function hapticImpact(style: ImpactStyleType): Promise<void> {
    vibrate(VIBRATION_DURATIONS[style] ?? 25);
}

export async function hapticNotification(type: NotificationTypeType): Promise<void> {
    vibrate(NOTIFICATION_PATTERNS[type] ?? [25]);
}

export async function hapticSelectionChanged(): Promise<void> {
    vibrate(5);
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
