import { Feather, Shield, Wand2, Skull, BookOpen, User, Settings, Brain } from 'lucide-react';
import { BackgroundVideo } from './BackgroundVideo';

interface AppShellProps {
    children: React.ReactNode;
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const navItems = [
    { id: 'home', icon: Shield, label: 'Stats' },
    { id: 'spells', icon: Wand2, label: 'Spells' },
    { id: 'combat', icon: Skull, label: 'Combat' },
    { id: 'grimoire', icon: BookOpen, label: 'Grimoire' },
    { id: 'abilities', icon: Brain, label: 'Abilities' },
    { id: 'bio', icon: User, label: 'Bio' },
    { id: 'settings', icon: Settings, label: 'Settings' },
];

export function AppShell({ children, activeTab, onTabChange }: AppShellProps) {
    return (
        <>
            {/* Background Image - OUTSIDE main container */}
            <BackgroundVideo />

            <div className="min-h-screen w-full relative z-10 bg-transparent text-text overflow-x-hidden">
                {/* Gradient Overlays - above background */}
                <div className="fixed inset-0 z-5 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-b from-white/3 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 h-60 bg-gradient-to-t from-bg-dark via-bg-dark/80 to-transparent" />
                    <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-bg-dark/60 to-transparent" />
                </div>

                {/* Header */}
                <header className="fixed top-0 left-0 right-0 z-40">
                    {/* Top Runic Border */}
                    <div className="h-1 w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                    <div className="bg-card/95 backdrop-blur-xl border-b border-white/10 relative">
                        {/* Corner Decorations */}
                        <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-white/30" />
                        <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-white/30" />

                        <div className="max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
                            {/* Left: Icon and Title */}
                            <div className="flex items-center gap-4">
                                {/* Glowing Quill Icon */}
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/15 to-white/5 border-2 border-white/30 flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.15)]">
                                        <Feather size={18} className="text-white" />
                                    </div>
                                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-white animate-pulse shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                                </div>

                                {/* Title */}
                                <div>
                                    <h1 className="font-display text-xl text-parchment-light tracking-[0.2em] drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                                        Aramancia
                                    </h1>
                                    <p className="text-[10px] text-white/50 font-sans uppercase tracking-[0.3em]">
                                        Tracker
                                    </p>
                                </div>
                            </div>

                            {/* Right: Character Info */}
                            <div className="flex items-center gap-3">
                                <div className="text-right">
                                    <p className="text-xs text-parchment font-display">Level 5</p>
                                    <p className="text-[10px] text-muted">Necromancer</p>
                                </div>
                                {/* Character Portrait */}
                                <div className="w-10 h-10 rounded-full border-2 border-white/30 overflow-hidden bg-card-elevated shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                                    <img
                                        src="/assets/aramancia-portrait.jpg"
                                        alt="Aramancia"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Bottom Ornate Border */}
                        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    </div>
                </header>

                {/* Main Content */}
                <main className="pt-24 px-4 pb-40 max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto relative z-10">
                    {children}
                </main>

                {/* Bottom Navigation - Scrollable */}
                <nav className="fixed bottom-0 left-0 right-0 z-50">
                    {/* Top Glow Line */}
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                    <div className="bg-card/98 backdrop-blur-xl border-t border-white/10 relative">
                        {/* Corner Decorations */}
                        <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-white/20" />
                        <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-white/20" />

                        <div className="max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto">
                            {/* Evenly distributed nav items */}
                            <div className="flex items-center justify-evenly py-2 px-1">
                                {navItems.map(({ id, icon: Icon, label }) => (
                                    <button
                                        key={id}
                                        onClick={() => onTabChange(id)}
                                        className={`flex flex-col items-center gap-1 px-2 py-1.5 rounded-lg transition-all duration-300 group ${activeTab === id
                                            ? 'text-white'
                                            : 'text-muted hover:text-parchment'
                                            }`}
                                    >
                                        <div className={`relative p-1.5 rounded-lg transition-all duration-300 ${activeTab === id
                                            ? 'bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.25)] border border-white/20'
                                            : 'group-hover:bg-white/5'
                                            }`}>
                                            <Icon size={16} />
                                            {activeTab === id && (
                                                <div className="absolute inset-0 rounded-lg bg-white/5 animate-pulse" />
                                            )}
                                        </div>
                                        <span className={`text-[8px] font-sans uppercase tracking-wide transition-colors duration-300 ${activeTab === id ? 'text-white' : 'group-hover:text-parchment'
                                            }`}>
                                            {label}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </nav>
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
