
import { useState, useMemo } from 'react';
import { Search, Plus, Shield, Sword, Box, Zap } from 'lucide-react';
import { Modal } from '../primitives/Modal';
import { Input } from '../primitives/Input';
import { Button } from '../primitives/Button';
import { Card } from '../primitives/Card';
import { Stack } from '../primitives/Stack';
import { SRDSearchService, SRDResult } from '../../services/SRDSearchService';
import { ItemMapper } from '../../utils/ItemMapper';
import { useAppDispatch } from '../../store/hooks';
import { inventoryItemAdded } from '../../store/slices/inventorySlice';
import { conditionAdded } from '../../store/slices/healthSlice';
import { showToast } from '../../store/slices/uiSlice';

interface SRDBrowserModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SRDBrowserModal({ isOpen, onClose }: SRDBrowserModalProps) {
    const dispatch = useAppDispatch();
    const [query, setQuery] = useState('');
    const [activeType, setActiveType] = useState<SRDResult['type'] | 'all'>('all');

    const results = useMemo(() => {
        if (query.length < 2) return [];
        let searchResults = SRDSearchService.search(query);
        if (activeType !== 'all') {
            searchResults = searchResults.filter(r => r.type === activeType);
        }
        return searchResults;
    }, [query, activeType]);

    const handleAdd = (result: SRDResult) => {
        let item;
        switch (result.type) {
            case 'weapon':
                item = ItemMapper.mapWeapon(result.data);
                break;
            case 'magicitem':
                item = ItemMapper.mapMagicItem(result.data);
                break;
            case 'armor':
                item = ItemMapper.mapArmor(result.data);
                break;
            default:
                return;
        }

        dispatch(inventoryItemAdded(item));
        dispatch(showToast(`Added ${item.name} to inventory`));
    };

    const handleApplyCondition = (result: SRDResult) => {
        if (result.type !== 'condition') return;
        dispatch(conditionAdded(result.data.name));
        dispatch(showToast(`Condition applied: ${result.data.name}`));
    };

    const getTypeIcon = (type: SRDResult['type']) => {
        switch (type) {
            case 'weapon': return <Sword size={14} className="text-accent" />;
            case 'armor': return <Shield size={14} className="text-secondary" />;
            case 'magicitem': return <Zap size={14} className="text-gold" />;
            case 'condition': return <Box size={14} className="text-vermillion" />;
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Universal D&D Database">
            <Stack gap={4}>
                <div className="relative">
                    <Input
                        placeholder="Search weapons, items, conditions..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="pl-10"
                        autoFocus
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-parchment/40" size={18} />
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {(['all', 'weapon', 'magicitem', 'armor', 'condition'] as const).map(type => (
                        <button
                            key={type}
                            onClick={() => setActiveType(type)}
                            className={`px-3 py-1 rounded-full text-xs uppercase tracking-widest border transition-all ${activeType === type
                                ? 'bg-accent text-bg-dark border-accent'
                                : 'bg-transparent text-parchment/60 border-parchment/20 hover:border-parchment/40'
                                }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>

                <div className="max-h-[60vh] overflow-y-auto space-y-3 pr-1 scrollbar-custom">
                    {query.length < 2 ? (
                        <div className="py-12 text-center text-parchment/30 italic font-body">
                            Type at least 2 characters to search...
                        </div>
                    ) : results.length === 0 ? (
                        <div className="py-12 text-center text-parchment/30 italic font-body">
                            No results found for "{query}"
                        </div>
                    ) : (
                        results.map((result, idx) => (
                            <Card key={`${result.type}-${idx}`} variant="interactive" className="group">
                                <div className="flex justify-between items-start gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            {getTypeIcon(result.type)}
                                            <h4 className="font-display text-sm tracking-wide text-parchment group-hover:text-accent transition-colors">
                                                {result.data.name}
                                            </h4>
                                        </div>
                                        <p className="text-xs text-parchment/50 line-clamp-2 leading-relaxed">
                                            {'desc' in result.data ? result.data.desc : ('cost' in result.data ? `${result.data.cost} | ${result.data.weight}` : '')}
                                        </p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => result.type === 'condition' ? handleApplyCondition(result) : handleAdd(result)}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Plus size={16} />
                                    </Button>
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            </Stack>
        </Modal>
    );
}
