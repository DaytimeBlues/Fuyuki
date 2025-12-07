import { Feather, Shield, Wand2, Skull, BookOpen, User, Settings } from 'lucide-react';
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
    { id: 'bio', icon: User, label: 'Bio' },
    { id: 'settings', icon: Settings, label: 'Settings' },
];

export function AppShell({ children, activeTab, onTabChange }: AppShellProps) {
    return (
        <div className="min-h-screen bg-bg text-text relative overflow-x-hidden">
            {/* Flame Video Background */}
            <BackgroundVideo />

            {/* Gradient Overlays */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 h-60 bg-gradient-to-t from-bg-dark via-bg-dark/80 to-transparent" />
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-bg-dark/60 to-transparent" />
            </div>

            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-40">
                {/* Top Runic Border */}
                <div className="h-1 w-full bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

                <div className="bg-card/95 backdrop-blur-xl border-b-2 border-parchment-dark/30 relative">
                    {/* Corner Decorations */}
                    <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-accent/40" />
                    <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-accent/40" />

                    <div className="max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
                        {/* Left: Icon and Title */}
                        <div className="flex items-center gap-4">
                            {/* Glowing Quill Icon */}
                            <div className="relative">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent/20 to-accent/5 border-2 border-accent/40 flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                                    <Feather size={18} className="text-accent" />
                                </div>
                                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-accent animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
                            </div>

                            {/* Title */}
                            <div>
                                <h1 className="font-display text-xl text-parchment-light tracking-[0.2em] drop-shadow-[0_0_10px_rgba(34,197,94,0.3)]">
                                    Aramancia
                                </h1>
                                <p className="text-[10px] text-accent/70 font-sans uppercase tracking-[0.3em]">
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
                            <div className="w-10 h-10 rounded-full border-2 border-parchment-dark/50 overflow-hidden bg-card-elevated shadow-[0_0_15px_rgba(0,0,0,0.5)]">
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
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-parchment-dark/50 to-transparent" />
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
                </div>
            </header>

            {/* Main Content */}
            <main className="pt-24 px-4 pb-28 max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto relative z-10">
                {children}
            </main>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 z-50">
                {/* Top Glow Line */}
                <div className="h-px w-full bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
                <div className="h-px w-full bg-gradient-to-r from-transparent via-parchment-dark/30 to-transparent" />

                <div className="bg-card/98 backdrop-blur-xl border-t-2 border-parchment-dark/20 relative">
                    {/* Corner Decorations */}
                    <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-accent/30" />
                    <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-accent/30" />

                    <div className="max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto px-4 py-3 flex items-center justify-around">
                        {navItems.map(({ id, icon: Icon, label }) => (
                            <button
                                key={id}
                                onClick={() => onTabChange(id)}
                                className={`flex flex-col items-center gap-1.5 px-3 py-2 rounded-lg transition-all duration-300 group ${activeTab === id
                                    ? 'text-accent'
                                    : 'text-muted hover:text-parchment'
                                    }`}
                            >
                                <div className={`relative p-1 rounded transition-all duration-300 ${activeTab === id
                                    ? 'bg-accent/10 shadow-[0_0_15px_rgba(34,197,94,0.4)]'
                                    : 'group-hover:bg-parchment-dark/20'
                                    }`}>
                                    <Icon size={18} />
                                    {activeTab === id && (
                                        <div className="absolute inset-0 rounded bg-accent/5 animate-pulse" />
                                    )}
                                </div>
                                <span className={`text-[9px] font-sans uppercase tracking-widest transition-colors duration-300 ${activeTab === id ? 'text-accent' : 'group-hover:text-parchment'
                                    }`}>
                                    {label}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </nav>
        </div>
    );
}
