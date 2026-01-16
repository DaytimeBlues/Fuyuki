import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { useGetSpellQuery } from '../../../store/api/open5eApi';

type SpellInfoModalProps = {
  spellSlug: string;
  onClose: () => void;
};

const getErrorMessage = (error: unknown) => {
  if (!error) return 'Unable to load spell details.';
  if ((error as FetchBaseQueryError).status) {
    return 'Unable to reach Open5e. Please check your connection.';
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Unable to load spell details.';
};

export function SpellInfoModal({ spellSlug, onClose }: SpellInfoModalProps) {
  const { data, isLoading, error } = useGetSpellQuery(spellSlug);

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
        <div className="rounded-xl bg-stone-950 border border-stone-800 px-6 py-4 text-stone-200">
          Loading spell details...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
        <div className="rounded-xl bg-stone-950 border border-red-900/50 px-6 py-4 text-stone-200 max-w-lg text-center space-y-3">
          <p className="text-red-400 font-display">{getErrorMessage(error)}</p>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-stone-800 text-stone-200 hover:bg-stone-700"
            data-testid="modal-close-btn"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
      data-testid="spell-info-modal"
    >
      <div
        className="w-full max-w-2xl rounded-2xl bg-stone-950 border border-stone-800 shadow-2xl p-6 space-y-4"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl text-accent" data-testid="spell-name">
              {data.name}
            </h2>
            <div className="text-sm text-stone-400">
              Level {data.level_int} {data.school} · {data.range}
            </div>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-2 rounded bg-stone-800 text-stone-200 hover:bg-stone-700"
            data-testid="modal-close-btn"
          >
            Close
          </button>
        </div>

        <div className="text-xs uppercase tracking-widest text-stone-500">
          {data.casting_time} · {data.duration}
        </div>

        <p className="text-sm text-stone-300 leading-relaxed" data-testid="spell-description">
          {data.desc}
        </p>

        {data.higher_level && (
          <p className="text-xs text-stone-400">
            <strong className="text-stone-300">At Higher Levels:</strong> {data.higher_level}
          </p>
        )}

        <div className="text-xs text-stone-500">
          Components: {data.components} · Concentration: {data.concentration}
        </div>
      </div>
    </div>
  );
}
