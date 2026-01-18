import { Shield, Wand2, Swords, User, Menu, Feather } from 'lucide-react';
// Background removed - using static image or CSS for battery optimization
import { ConcentrationFloatingBubble } from '../ui/ConcentrationFloatingBubble';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { ModeToggle } from '../ui/ModeToggle';

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
    const isTablet = useMediaQuery('(min-width: 768px)');

    return (
        <>
            {/* Kyoto Noir Background */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <img
                    src={`${import.meta.env.BASE_URL}assets/fuyuki-background.jpg`}
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

                {isTablet ? (
                    /* TABLET / DESKTOP LAYOUT (Master-Detail) */
                    <div className="flex h-screen overflow-hidden pt-4 px-4 pb-4 gap-4">
                        {/* Sidebar Navigation */}
                        <aside className="w-64 glass-card rounded-2xl flex flex-col justify-between p-4 z-40">
                            <div>
                                {/* Header in Sidebar */}
                                <div className="flex items-center gap-3 mb-8 px-2">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-bg-card to-bg-dark border border-white/10 flex items-center justify-center shadow-lg">
                                        <Feather size={20} className="text-gold-mid" />
                                    </div>
                                    <div>
                                        <h1 className="font-display font-bold text-lg text-white tracking-widest uppercase">Fuyuki</h1>
                                        <p className="text-[10px] text-muted font-mono uppercase tracking-widest">Warlock Tracker</p>
                                    </div>
                                </div>

                                <div className="mb-6 px-2 flex justify-center">
                                    <ModeToggle />
                                </div>

                                {/* Nav Items */}
                                <nav className="flex flex-col gap-2">
                                    {navItems.map((item) => {
                                        const { id, icon: Icon, label } = item;
                                        const isActive = activeTab === id;
                                        return (
                                            <button
                                                key={id}
                                                onClick={() => onTabChange(id)}
                                                data-testid={`nav-tab-${id}`}
                                                className={`
                                                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                                                    ${isActive ? 'bg-white/10 shadow-accent-sm border border-gold-dim/20' : 'hover:bg-white/5 border border-transparent'}
                                                `}
                                            >
                                                <Icon
                                                    size={20}
                                                    className={isActive ? 'text-gold-bright' : 'text-muted group-hover:text-parchment'}
                                                />
                                                <div className="flex flex-col items-start">
                                                    <span className={`text-xs font-display uppercase tracking-widest ${isActive ? 'text-white' : 'text-muted group-hover:text-parchment'}`}>
                                                        {label}
                                                    </span>
                                                </div>
                                                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-gold-bright shadow-accent-sm" />}
                                            </button>
                                        );
                                    })}
                                </nav>
                            </div>

                            {/* Character Mini-Profile in Sidebar */}
                            <div className="p-3 rounded-xl bg-bg-dark/50 border border-white/5 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full border border-gold-dim/30 overflow-hidden bg-bg-dark">
                                    <img src={`${import.meta.env.BASE_URL}assets/fuyuki-portrait.png`} alt="Fuyuki" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                                </div>
                                <div>
                                    <p className="text-xs text-parchment font-display">Level 5</p>
                                    <p className="text-[10px] text-muted font-japanese">狐の妖術師</p>
                                </div>
                            </div>
                        </aside>

                        {/* Main Content Area */}
                        <main className="flex-1 glass-card rounded-2xl overflow-y-auto relative z-10 scrollbar-hide">
                            <div className="p-6 max-w-4xl mx-auto">
                                {children}
                            </div>
                        </main>
                    </div>
                ) : (
                    /* MOBILE LAYOUT (Original + Thumb Zone) */
                    <>
                        <header className="fixed top-0 left-0 right-0 z-40 px-4 pt-4 pb-2">
                            <div className="glass-card rounded-2xl max-w-md mx-auto flex items-center justify-between p-3 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none" />
                                <div className="flex items-center gap-4 z-10">
                                    <div className="relative">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-bg-card to-bg-dark border border-white/10 flex items-center justify-center shadow-lg relative overflow-hidden">
                                            <Feather size={20} className="text-gold-mid relative z-10" />
                                            <div className="absolute inset-0 bg-gold-mid/10 blur-xl" />
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-gold-bright animate-pulse shadow-accent-sm" />
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="flex items-baseline gap-2">
                                            <h1 className="font-display font-bold text-xl text-white tracking-[0.2em] uppercase">Fuyuki</h1>
                                            <span className="text-xs text-gold-dim font-japanese opacity-80">冬木</span>
                                        </div>
                                        <p className="text-[10px] text-muted font-mono uppercase tracking-[0.2em]">Warlock Tracker</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 z-10">
                                    <ModeToggle />
                                    <div className="text-right hidden xs:block">
                                        <p className="text-xs text-parchment font-display">Level 5</p>
                                        <p className="text-[10px] text-muted font-japanese">狐の妖術師</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-full border-2 border-gold-dim/30 overflow-hidden bg-bg-dark shadow-lg">
                                        <img src={`${import.meta.env.BASE_URL}assets/fuyuki-portrait.png`} alt="Fuyuki" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                                    </div>
                                </div>
                            </div>
                        </header>

                        <main className="pt-28 px-4 pb-48 max-w-md mx-auto relative z-10">
                            {children}
                        </main>

                        {/* Thumb Zone Bottom Nav */}
                        <nav className="fixed bottom-6 left-0 right-0 z-50 pointer-events-none px-4">
                            <div className="pointer-events-auto max-w-md mx-auto glass-card rounded-2xl p-2 border border-white/10 shadow-2xl">
                                <div className="flex items-center justify-between px-2">
                                    {navItems.map((item, index) => {
                                        const { id, icon: Icon, label, ja } = item;
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
                                                <span className={`
                                                    absolute -top-8 text-[10px] font-japanese text-gold-mid
                                                    transition-all duration-300 pointer-events-none
                                                    ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 group-hover:opacity-70 group-hover:translate-y-0'}
                                                `}>
                                                    {ja}
                                                </span>
                                                {isActive && (
                                                    <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-gold-bright shadow-accent-sm" />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </nav>
                    </>
                )}

                {/* Global Overlays */}
                <ConcentrationFloatingBubble />

                {/* App ready indicator for E2E tests - always visible element */}
                <div data-testid="app-ready" style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }} />

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
