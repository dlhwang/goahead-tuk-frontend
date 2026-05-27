import { useState } from 'react';
import { useConfessionReactionMutation } from '@/features/confession/api/confessionQueries';
import {
  reactionLabels,
  reactionTypes,
  type ConfessionReaction,
  type ReactionType,
} from '@/features/confession/model/types';
import {
  getSelectedReactions,
  setSelectedReaction,
} from '@/shared/storage/reactionSelections';

type ReactionButtonsProps = {
  confessionId: string;
  reactions?: ConfessionReaction[];
};

export function ReactionButtons({ confessionId, reactions }: ReactionButtonsProps) {
  const [selectedReactions, setSelectedReactions] = useState<ReactionType[]>(() =>
    getSelectedReactions(confessionId),
  );
  const mutation = useConfessionReactionMutation(confessionId);

  function handleToggle(type: ReactionType) {
    const selected = selectedReactions.includes(type);
    mutation.reset();
    mutation.mutate(
      { type, selected },
      {
        onSuccess: () => {
          setSelectedReactions(setSelectedReaction(confessionId, type, !selected));
        },
      },
    );
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2" aria-label="반응 선택">
        {reactionTypes.map((type) => {
          const label = reactionLabels[type];
          const selected = selectedReactions.includes(type);
          const count = reactions?.find((reaction) => reaction.type === type)?.count ?? 0;

          return (
            <button
              key={type}
              type="button"
              disabled={mutation.isPending}
              aria-pressed={selected}
              onClick={() => handleToggle(type)}
              className={`rounded-full border px-3 py-2 text-xs font-medium transition disabled:cursor-wait disabled:opacity-60 ${
                selected
                  ? 'border-amber/70 bg-amber/20 text-amber'
                  : 'border-white/10 bg-white/[0.07] text-mist/72 hover:border-lavender/40'
              }`}
            >
              <span aria-hidden="true">{label.emoji}</span> {label.label} {count}
            </button>
          );
        })}
      </div>
      {mutation.isError ? (
        <p className="mt-2 text-xs text-amber" role="alert">
          반응을 처리하지 못했어요. 잠시 후 다시 시도해 주세요.
        </p>
      ) : null}
    </div>
  );
}
