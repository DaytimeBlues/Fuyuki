import { useState, useEffect } from 'react';
import { Feather, RefreshCw, CheckCircle2 } from 'lucide-react';

export function PatronView() {
    const [phase, setPhase] = useState<'IDLE' | 'GENERATING' | 'READY' | 'SIGNED'>('IDLE');
    const [inkOpacity, setInkOpacity] = useState(0);

    // Simulate "Nano Banana" Generation Process
    useEffect(() => {
        if (phase === 'GENERATING') {
            const timer = setTimeout(() => {
                setPhase('READY');
            }, 3000); // 3 seconds generation simulation
            return () => clearTimeout(timer);
        }
    }, [phase]);

    // Ink Fade In Effect
    useEffect(() => {
        if (phase === 'READY') {
            requestAnimationFrame(() => setInkOpacity(1));
        }
    }, [phase]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8 relative p-4">

            {/* Header / Context */}
            <div className="text-center space-y-2 z-10">
                <h2 className="text-2xl font-display font-bold text-white tracking-[0.2em] uppercase">Pactsworn</h2>
                <p className="text-xs text-muted font-mono uppercase tracking-widest">Invoke the Entity</p>
            </div>

            {/* The Artifact / Asset Container */}
            <div className={`
                relative w-64 h-64 flex items-center justify-center
                transition-all duration-1000
                ${phase === 'GENERATING' ? 'animate-pulse scale-95 opacity-50' : 'scale-100 opacity-100'}
            `}>

                {/* Background Ring */}
                <div className="absolute inset-0 rounded-full border border-gold-dim/20 animate-spin-slow" />
                <div className="absolute inset-4 rounded-full border border-white/5 animate-reverse-spin-slower" />

                {/* The Entity (Only visible when READY or SIGNED) */}
                {(phase === 'READY' || phase === 'SIGNED') && (
                    <div
                        className="relative w-48 h-48 transition-all duration-1000 ease-in-out"
                        style={{ opacity: inkOpacity, transform: `scale(${inkOpacity})` }}
                    >
                        <img
                            src="/assets/patron-entity.png"
                            alt="Unknown Patron"
                            className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(255,215,0,0.3)]"
                        />
                        {/* Glitch Overlay */}
                        <div className="absolute inset-0 bg-gold-bright/10 mix-blend-overlay animate-pulse" />
                    </div>
                )}

                {/* Loading State */}
                {phase === 'GENERATING' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Feather className="text-gold-dim animate-spin" size={32} />
                        <span className="absolute mt-12 text-[10px] text-gold-dim font-mono animate-pulse">GENERATING PACT...</span>
                    </div>
                )}

                {/* Initial State Placeholder */}
                {phase === 'IDLE' && (
                    <div className="w-32 h-32 rounded-full border-2 border-dashed border-white/10 flex items-center justify-center">
                        <span className="text-4xl opacity-20">?</span>
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="z-10 flex flex-col gap-4 w-full max-w-xs">
                {phase === 'IDLE' && (
                    <button
                        onClick={() => setPhase('GENERATING')}
                        className="btn-ghost border border-gold-dim/30 text-gold-mid hover:bg-gold-dim/10 w-full py-4 rounded-xl flex items-center justify-center gap-2 uppercase tracking-widest text-xs font-bold transition-all"
                    >
                        <RefreshCw size={14} />
                        Consult the Void
                    </button>
                )}

                {phase === 'READY' && (
                    <>
                        <button
                            onClick={() => setPhase('SIGNED')}
                            className="btn-primary w-full py-4 rounded-xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,215,0,0.2)] animate-pulse-slow group"
                        >
                            <Feather size={16} className="text-bg-dark" />
                            <span className="text-bg-dark font-bold tracking-widest">Sign the Pact</span>
                        </button>
                        <button
                            onClick={() => { setPhase('IDLE'); setInkOpacity(0); }}
                            className="text-[10px] text-muted hover:text-white uppercase tracking-widest transition-colors"
                        >
                            Reject & Retry
                        </button>
                    </>
                )}

                {phase === 'SIGNED' && (
                    <div className="w-full py-4 rounded-xl bg-gold-dim/10 border border-gold-dim/30 flex items-center justify-center gap-2 animate-fade-in-up">
                        <CheckCircle2 size={16} className="text-gold-bright" />
                        <span className="text-gold-bright font-display tracking-widest uppercase text-sm">Pact Sealed</span>
                    </div>
                )}
            </div>

            {/* Background Texture Overlay (Subtle) */}
            <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-5 pointer-events-none mix-blend-overlay" />
        </div>
    );
}
