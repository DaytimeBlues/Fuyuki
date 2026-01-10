import type { Session, CharacterData, Minion } from '../types';
import { initialCharacterData } from '../data/initialState';

const SESSIONS_KEY = 'aramancia-sessions';
const ACTIVE_SESSION_KEY = 'aramancia-active-session';

export function generateSessionId(): string {
    return crypto.randomUUID();
}

export function getSessions(): Session[] {
    const saved = localStorage.getItem(SESSIONS_KEY);
    return saved ? JSON.parse(saved) : [];
}

export function saveSessions(sessions: Session[]): void {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
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
