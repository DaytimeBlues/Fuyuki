import { useState } from 'react';
import type { Session } from '../types';
import { getSessions, createSession, continueSession, deleteSession } from '../utils/sessionStorage';
import { Calendar, Plus, Play, Trash2, X } from 'lucide-react';

interface SessionPickerProps {
    onSessionSelected: (session: Session) => void;
    onClose?: () => void;
}

export function SessionPicker({ onSessionSelected, onClose }: SessionPickerProps) {
    const [sessions] = useState<Session[]>(() => getSessions());
    const [showNewForm, setShowNewForm] = useState(sessions.length === 0);
    const [sessionNumber, setSessionNumber] = useState(
        sessions.length > 0 ? Math.max(...sessions.map(s => s.sessionNumber)) + 1 : 1
    );
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [label, setLabel] = useState('');

    const handleNewSession = () => {
        const session = createSession(sessionNumber, date, label || undefined);
        onSessionSelected(session);
    };

    const handleContinue = (id: string) => {
        const session = continueSession(id);
        if (session) {
            onSessionSelected(session);
        }
    };

    const handleDelete = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm('Delete this session? This cannot be undone.')) {
            deleteSession(id);
            window.location.reload();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
            <div className="card-parchment w-full max-w-md max-h-[85vh] flex flex-col shadow-2xl animate-scale-in">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-white/10">
                    <div className="flex items-center gap-2">
                        <Calendar size={20} className="text-white" />
                        <h2 className="font-display text-lg text-parchment-light tracking-wider">Sessions</h2>
                    </div>
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full bg-white/5 border border-white/20 text-white/60 hover:text-white hover:bg-white/10 transition-all"
                        >
                            <X size={18} />
                        </button>
                    )}
                </div>

                {/* Content */}
                <div className="p-4 overflow-y-auto flex-1">
                    {showNewForm ? (
                        <div className="space-y-4">
                            <h3 className="font-display text-sm text-parchment tracking-wider">New Session</h3>

                            <div>
                                <label className="text-xs text-muted block mb-1">Session #</label>
                                <input
                                    type="number"
                                    value={sessionNumber}
                                    onChange={(e) => {
                                        const num = parseInt(e.target.value) || 1;
                                        setSessionNumber(Math.max(1, Math.min(9999, num)));
                                    }}
                                    className="w-full bg-card-elevated border border-white/10 rounded px-3 py-2 text-parchment focus:outline-none focus:border-white/30"
                                />
                            </div>

                            <div>
                                <label className="text-xs text-muted block mb-1">Date</label>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full bg-card-elevated border border-white/10 rounded px-3 py-2 text-parchment focus:outline-none focus:border-white/30"
                                />
                            </div>

                            <div>
                                <label className="text-xs text-muted block mb-1">Label (optional)</label>
                                <input
                                    type="text"
                                    value={label}
                                    onChange={(e) => setLabel(e.target.value)}
                                    placeholder="e.g. 'Battle at Ravenloft'"
                                    className="w-full bg-card-elevated border border-white/10 rounded px-3 py-2 text-parchment placeholder:text-muted/50 focus:outline-none focus:border-white/30"
                                />
                            </div>

                            <div className="flex gap-2 pt-2">
                                {sessions.length > 0 && (
                                    <button
                                        onClick={() => setShowNewForm(false)}
                                        className="btn-fantasy flex-1"
                                    >
                                        Back
                                    </button>
                                )}
                                <button
                                    onClick={handleNewSession}
                                    className="btn-primary flex-1 flex items-center justify-center gap-2"
                                >
                                    <Plus size={16} />
                                    Start Session
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* New Session Button */}
                            <button
                                onClick={() => setShowNewForm(true)}
                                className="w-full btn-primary flex items-center justify-center gap-2 py-3"
                            >
                                <Plus size={18} />
                                New Session
                            </button>

                            {/* Previous Sessions */}
                            {sessions.length > 0 && (
                                <>
                                    <div className="flex items-center gap-2 pt-2">
                                        <div className="h-px flex-1 bg-white/10" />
                                        <span className="text-xs text-muted">or continue</span>
                                        <div className="h-px flex-1 bg-white/10" />
                                    </div>

                                    <div className="space-y-2">
                                        {sessions
                                            .sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime())
                                            .map((session) => (
                                                <div
                                                    key={session.id}
                                                    className="flex items-center gap-3 p-3 rounded-lg bg-card-elevated/60 border border-white/10 cursor-pointer hover:border-white/30 transition-all group"
                                                    onClick={() => handleContinue(session.id)}
                                                >
                                                    <div className="p-2 bg-card rounded-lg border border-white/10">
                                                        <Play size={16} className="text-parchment" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-sm font-display text-parchment-light">
                                                            Session {session.sessionNumber}
                                                            {session.label && (
                                                                <span className="text-muted ml-2">• {session.label}</span>
                                                            )}
                                                        </div>
                                                        <div className="text-xs text-muted truncate">
                                                            {new Date(session.date).toLocaleDateString()} •
                                                            HP: {session.characterData.hp.current}/{session.characterData.hp.max}
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={(e) => handleDelete(session.id, e)}
                                                        className="p-2 rounded-full opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
