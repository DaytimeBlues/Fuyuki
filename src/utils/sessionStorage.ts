import type { Session, CharacterData, Minion } from '../types';
import { initialCharacterData } from '../data/initialState';

const SESSIONS_KEY = 'aramancia-sessions';
const ACTIVE_SESSION_KEY = 'aramancia-active-session';

/**
 * Schema version for localStorage data migrations.
 * Increment when CharacterData or Session structure changes.
 */
export const SCHEMA_VERSION = '2.0';

export function generateSessionId(): string {
    return crypto.randomUUID();
}

/**
 * Migrates session data from older versions to the current schema.
 */
function migrateSession(session: unknown): Session {
    // If no version or version < 2.0
    const version = parseFloat(session.version || '1.0');

    if (version < 2.0) {
        // Migration to 2.0: Ensure minions have speed
        if (Array.isArray(session.minions)) {
            session.minions = session.minions.map((m: unknown) => ({
                ...m,
                speed: m.speed ?? 30, // Default speed if missing
                type: m.type ? m.type.toLowerCase() : 'skeleton' // Normalizing type to lowercase
            }));
        }
        session.version = '2.0';
    }

    return session as Session;
}

/**
 * Validates that the parsed data conforms to the Session schema.
 * Returns true if valid, false if corrupted or invalid structure.
 */
function validateSessionSchema(data: unknown): data is Session {
    if (!data || typeof data !== 'object') return false;
    const session = data as Record<string, unknown>;

    // Required string fields
    if (typeof session.id !== 'string') return false;
    if (typeof session.sessionNumber !== 'number') return false;
    if (typeof session.date !== 'string') return false;
    if (typeof session.lastModified !== 'string') return false;

    // characterData must be an object with required fields
    if (!session.characterData || typeof session.characterData !== 'object') return false;
    const charData = session.characterData as Record<string, unknown>;
    if (!charData.hp || typeof charData.hp !== 'object') return false;
    if (typeof charData.level !== 'number') return false;

    // minions must be an array
    if (!Array.isArray(session.minions)) return false;

    return true;
}

/**
 * Validates and returns sessions array, filtering out corrupted entries.
 * In "safe mode", invalid sessions are skipped rather than crashing the app.
 */
function validateSessionsArray(data: unknown): Session[] {
    if (!Array.isArray(data)) return [];

    return data
        .map(item => migrateSession(item)) // Migrate before validation
        .filter((item): item is Session => {
            const isValid = validateSessionSchema(item);
            if (!isValid) {
                console.warn('Skipping corrupted session entry:', item);
            }
            return isValid;
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
    if (!id) return null;
    const sessions = getSessions();
    return sessions.find(s => s.id === id) || null;
}

export function createSession(sessionNumber: number, date: string, label?: string): Session {
    const session: Session = {
        id: generateSessionId(),
        sessionNumber,
        date,
        label,
        characterData: { ...initialCharacterData },
        minions: [],
        lastModified: new Date().toISOString()
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
