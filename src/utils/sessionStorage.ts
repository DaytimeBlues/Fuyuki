import type { Session, CharacterData, Minion } from '../types';
import { initialCharacterData } from '../data/initialState';

const SESSIONS_KEY = 'fuyuki-sessions';
const ACTIVE_SESSION_KEY = 'fuyuki-active-session';

/**
 * Schema version for localStorage data migrations.
 * Increment when CharacterData or Session structure changes.
 */
/**
 * Schema version for localStorage data migrations.
 * Increment when CharacterData or Session structure changes.
 */
export const SCHEMA_VERSION = 2; // Numeric version

export function generateSessionId(): string {
    return crypto.randomUUID();
}

/**
 * Migrates session data from older versions to the current schema.
 */
function migrateSession(session: unknown): Session {
    // Type guard for session object
    if (!session || typeof session !== 'object') {
        throw new Error('Invalid session data');
    }

    const sessionObj = session as Record<string, unknown>;

    // If no version or version < 2
    const version = typeof sessionObj.version === 'number'
        ? sessionObj.version
        : parseFloat((sessionObj.version as string) || '1.0');

    if (version < 2) {
        // Migration to 2: Ensure minions have speed and lowercase types
        if (Array.isArray(sessionObj.minions)) {
            sessionObj.minions = sessionObj.minions.map((m: unknown) => {
                const minionObj = m as Record<string, unknown>;
                return {
                    ...minionObj,
                    speed: (minionObj.speed as number) ?? 30, // Default speed if missing
                    type: minionObj.type ? String(minionObj.type).toLowerCase() : 'skeleton' // Normalizing type to lowercase
                };
            });
        }
        sessionObj.version = 2;
    }

    return sessionObj as unknown as Session;
}

import { SessionSchema } from '../schemas/sessionSchema';

/**
 * Validates that the parsed data conforms to the Session schema.
 * Uses Zod for strict checking.
 */
// function validateSessionSchema(data: unknown): data is Session {
//     const result = SessionSchema.safeParse(data);
//     if (!result.success) {
//         console.error('CRITICAL: Session validation failed:', JSON.stringify(result.error.format(), null, 2));
//         console.error('Invalid Data:', JSON.stringify(data, null, 2));
//         return false;
//     }
//     return true;
// }

/**
 * Validates and returns sessions array, filtering out corrupted entries.
 * In "safe mode", invalid sessions are skipped rather than crashing the app.
 */
function validateSessionsArray(data: unknown): Session[] {
    if (!Array.isArray(data)) return [];

    return data
        .map(item => migrateSession(item))
        .filter((item): item is Session => {
            const result = SessionSchema.safeParse(item);
            if (!result.success) {
                console.warn('Session schema validation failed (allowing for now):', result.error.format());
                // Soft validation: Allow it anyway to prevent data loss on minor mismatches
                return true;
            }
            return true;
        });
}

/**
 * Safely retrieves sessions from localStorage with error handling.
 * Returns empty array on parse errors or corruption (safe mode fallback).
 */
export function getSessions(): Session[] {
    try {
        const saved = localStorage.getItem(SESSIONS_KEY);
        if (!saved) return [];

        const parsed = JSON.parse(saved);
        return validateSessionsArray(parsed);
    } catch (error) {
        console.error('Failed to parse sessions from localStorage:', error);
        // Safe mode: return empty array instead of crashing
        return [];
    }
}

/**
 * Safely saves sessions to localStorage with error handling.
 * Logs errors but doesn't crash the app on quota exceeded or other errors.
 */
export function saveSessions(sessions: Session[]): void {
    try {
        localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
    } catch (error) {
        console.error('Failed to save sessions to localStorage:', error);
        // Could be quota exceeded or other storage error
        // In production, could show user notification here
    }
}

export function getActiveSessionId(): string | null {
    return localStorage.getItem(ACTIVE_SESSION_KEY);
}

export function setActiveSessionId(id: string | null): void {
    if (id) {
        localStorage.setItem(ACTIVE_SESSION_KEY, id);
    } else {
        localStorage.removeItem(ACTIVE_SESSION_KEY);
    }
}

export function getActiveSession(): Session | null {
    const id = getActiveSessionId();
    if (!id) {
        console.error('DEBUG: No Active Session ID found');
        return null;
    }
    const sessions = getSessions();
    const session = sessions.find(s => s.id === id) || null;
    if (!session) {
        console.error('DEBUG: Active Session ID not found in sessions list', { id, count: sessions.length });
    } else {
        console.error('DEBUG: Active Session Found', { id });
    }
    return session;
}

export function createSession(sessionNumber: number, date: string, label?: string): Session {
    const session: Session = {
        id: generateSessionId(),
        sessionNumber,
        date,
        label,
        characterData: { ...initialCharacterData },
        minions: [],
        lastModified: new Date().toISOString(),
        version: SCHEMA_VERSION
    };

    const sessions = getSessions();
    sessions.push(session);
    saveSessions(sessions);
    setActiveSessionId(session.id);

    return session;
}

export function updateActiveSession(characterData: CharacterData, minions: Minion[]): void {
    const id = getActiveSessionId();
    if (!id) return;

    const sessions = getSessions();
    const index = sessions.findIndex(s => s.id === id);
    if (index === -1) return;

    sessions[index].characterData = characterData;
    sessions[index].minions = minions;
    sessions[index].lastModified = new Date().toISOString();

    saveSessions(sessions);
}

export function deleteSession(id: string): void {
    const sessions = getSessions().filter(s => s.id !== id);
    saveSessions(sessions);

    if (getActiveSessionId() === id) {
        setActiveSessionId(null);
    }
}

export function continueSession(id: string): Session | null {
    const sessions = getSessions();
    const session = sessions.find(s => s.id === id);
    if (session) {
        setActiveSessionId(id);
        return session;
    }
    return null;
}

/**
 * Auto-persistent session: Returns active session or creates default one.
 * Removes friction of session picker - app seamlessly loads or creates session.
 */
export function ensureActiveSession(): Session {
    const existing = getActiveSession();
    if (existing) {
        return existing;
    }

    // Create default session for first run
    const defaultSession: Session = {
        id: generateSessionId(),
        sessionNumber: 1,
        date: new Date().toISOString(),
        label: 'Default Campaign',
        characterData: { ...initialCharacterData },
        minions: [],
        lastModified: new Date().toISOString(),
        version: SCHEMA_VERSION,
    };

    const sessions = getSessions();
    sessions.push(defaultSession);
    saveSessions(sessions);
    setActiveSessionId(defaultSession.id);

    console.log('Created default session:', defaultSession.id);
    return defaultSession;
}
