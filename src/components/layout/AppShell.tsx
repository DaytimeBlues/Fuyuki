import { Shield, Wand2, Swords, User, Menu, Feather } from 'lucide-react';
// Background removed - using static image or CSS for battery optimization
import { ConcentrationFloatingBubble } from '../ui/ConcentrationFloatingBubble';

interface AppShellProps {
    children: React.ReactNode;
    activeTab: string;
    onTabChange: (tab: string) => void;
    toast?: string | null;
    clearToast?: () => void;
    showSessionPicker?: boolean;
    renderSessionPicker?: () => React.ReactNode;
}

const navItems = [
    { id: 'stats', icon: Shield, label: 'Stats', ja: 'ステータス' },
    { id: 'spells', icon: Wand2, label: 'Spells', ja: '呪文' },
    { id: 'combat', icon: Swords, label: 'Combat', ja: '戦闘' },
    { id: 'character', icon: User, label: 'Profile', ja: '人物' },
    { id: 'more', icon: Menu, label: 'Menu', ja: '目録' },
];

export function AppShell({
    children,
    activeTab,
    onTabChange,
    toast,
    showSessionPicker,
    renderSessionPicker
}: AppShellProps) {
    return (
        <>
            {/* Kyoto Noir Background */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <img
                    src="/assets/fuyuki-background.jpg"
                    alt=""
                    className="w-full h-full object-cover opacity-30 scale-105 contrast-125 saturate-50"
                    onError={(e) => {
                        e.currentTarget.style.display = 'none';
                    }}
                />
                <div className="absolute inset-0 bg-bg-void/90 mix-blend-multiply" />
                {/* Decorative Vertical Text - Right Side */}
                <div className="absolute top-24 right-4 writing-vertical-rl text-6xl text-white/5 font-black font-japanese pointer-events-none select-none">
                    ウォーロック
                </div>
            </div>

            <div className="min-h-screen w-full relative z-10 bg-transparent text-text overflow-x-hidden" data-testid="app-ready">
                {/* Gradient Overlays - above background */}
                <div className="fixed inset-0 z-5 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-b from-white/3 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 h-60 bg-gradient-to-t from-bg-dark via-bg-dark/80 to-transparent" />
                    <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-bg-dark/70 to-transparent" />
                </div>

                {/* Header */}
                <header className="fixed top-0 left-0 right-0 z-40 px-4 pt-4 pb-2">
                    <div className="glass-card rounded-2xl max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto flex items-center justify-between p-3 relative overflow-hidden group">

                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none" />

                        {/* Left: Icon and Title */}
                        <div className="flex items-center gap-4 z-10">
                            {/* Glowing Quill Icon */}
                            <div className="relative">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-bg-card to-bg-dark border border-white/10 flex items-center justify-center shadow-lg relative overflow-hidden">
                                    <Feather size={20} className="text-gold-mid relative z-10" />
                                    <div className="absolute inset-0 bg-gold-mid/10 blur-xl" />
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-gold-bright animate-pulse shadow-accent-sm" />
                            </div>

                            {/* Title */}
                            <div className="flex flex-col">
                                <div className="flex items-baseline gap-2">
                                    <h1 className="font-display text-xl text-white tracking-[0.2em] uppercase">
                                        Fuyuki
                                    </h1>
                                    <span className="text-xs text-gold-dim font-japanese opacity-80">冬木</span>
                                </div>
                                <p className="text-[10px] text-muted font-mono uppercase tracking-[0.2em]">
                                    Warlock Tracker
                                </p>
                            </div>
                        </div>

                        {/* Right: Character Info */}
                        <div className="flex items-center gap-3 z-10">
                            <div className="text-right hidden xs:block">
                                <p className="text-xs text-parchment font-display">Level 5</p>
                                <p className="text-[10px] text-muted font-japanese">狐の妖術師</p>
                            </div>
                            {/* Character Portrait */}
                            <div className="w-10 h-10 rounded-full border-2 border-gold-dim/30 overflow-hidden bg-bg-dark shadow-lg">
                                <img
                                    src="/assets/fuyuki-portrait.png"
                                    alt="Fuyuki"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="pt-28 px-4 pb-48 max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto relative z-10">
                    {children}
                </main>

                {/* Bottom Navigation - Kyoto Dock */}
                <nav className="fixed bottom-6 left-0 right-0 z-50 pointer-events-none px-4">
                    <div className="pointer-events-auto max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto glass-card rounded-2xl p-2 border border-white/10 shadow-2xl">
                        <div className="flex items-center justify-between px-2">
                            {navItems.map(({ id, icon: Icon, label, ja }, index) => {
                                const isActive = activeTab === id;
                                return (
                                    <button
                                        key={id}
                                        onClick={() => onTabChange(id)}
                                        className={`
                                            group relative flex flex-col items-center justify-center 
                                            w-16 h-16 rounded-xl transition-all duration-300
                                            animate-slide-up hover:-translate-y-1
                                            stagger-${index + 1}
                                            ${isActive ? 'bg-white/10 shadow-lg' : 'hover:bg-white/5'}
                                        `}
                                        data-testid={`nav-tab-${id}`}
                                        aria-label={label}
                                    >
                                        <Icon
                                            size={20}
                                            strokeWidth={isActive ? 2.5 : 1.5}
                                            className={`
                                                mb-1 transition-colors duration-300
                                                ${isActive ? 'text-gold-bright drop-shadow-md' : 'text-muted group-hover:text-parchment'}
                                            `}
                                        />
                                        <span className={`
                                            text-[9px] font-display uppercase tracking-widest transition-colors duration-300
                                            ${isActive ? 'text-white' : 'text-muted/60 group-hover:text-parchment'}
                                        `}>
                                            {label}
                                        </span>

                                        {/* Japanese Sub-label (appears on hover or active) */}
                                        <span className={`
                                            absolute -top-8 text-[10px] font-japanese text-gold-mid
                                            transition-all duration-300 pointer-events-none
                                            ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 group-hover:opacity-70 group-hover:translate-y-0'}
                                        `}>
                                            {ja}
                                        </span>

                                        {/* Active Indicator Dot */}
                                        {isActive && (
                                            <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-gold-bright shadow-accent-sm" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </nav>

                {/* Global Overlays */}
                <ConcentrationFloatingBubble />

                {/* Toast */}
                {toast && (
                    <div
                        className="fixed top-24 left-1/2 -translate-x-1/2 glass-card px-6 py-4 rounded-xl z-[100] animate-slide-down flex items-center gap-3 border-l-4 border-gold-mid"
                        data-testid="toast-message"
                    >
                        <div className="w-2 h-2 rounded-full bg-gold-bright animate-pulse" />
                        <span className="font-display text-sm uppercase tracking-widest text-white">
                            {toast}
                        </span>
                    </div>
                )}

                {/* Session Picker Modal */}
                {showSessionPicker && renderSessionPicker && renderSessionPicker()}
            </div>

            {/* Hide scrollbar but keep functionality */}
            <style>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </>
    );
}
