import { BarChart2, Zap, Skull, Settings } from 'lucide-react';

interface DockProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export function Dock({ activeTab, onTabChange }: DockProps) {
    const tabs = [
        { id: 'home', icon: BarChart2, label: 'Dashboard' },
        { id: 'spells', icon: Zap, label: 'Spells' },
        { id: 'combat', icon: Skull, label: 'Necro' },
        { id: 'settings', icon: Settings, label: 'Settings' },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-gradient-to-t from-black to-transparent z-50">
            <div className="flex justify-around items-center bg-card/80 backdrop-blur-md rounded-full border border-white/10 p-2 shadow-2xl shadow-black">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`p-4 rounded-full transition-all duration-300 ${isActive
                                    ? 'text-white bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                                    : 'text-gray-600 hover:text-gray-400'
                                }`}
                        >
                            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
