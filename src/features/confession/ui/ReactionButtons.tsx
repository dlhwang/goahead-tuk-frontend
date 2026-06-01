import { useConfessionReactionMutation } from '@/features/confession/api/confessionQueries';
import {
  normalizeConfessionReactions,
  reactionLabels,
  type ConfessionReaction,
} from '@/features/confession/model/types';

type ReactionButtonsProps = {
  confessionId: string;
  reactions?: ConfessionReaction[];
};

export function ReactionButtons({ confessionId, reactions }: ReactionButtonsProps) {
  const mutation = useConfessionReactionMutation(confessionId);
  const normalizedReactions = normalizeConfessionReactions(reactions);

  function handleToggle(reaction: ConfessionReaction) {
    mutation.reset();
    mutation.mutate({ type: reaction.type, selected: reaction.selectedByMe });
  }

  return (
    <div>
      <div className="grid grid-cols-3 gap-1.5 sm:gap-2" aria-label="반응 선택">
        {normalizedReactions.map((reaction) => {
          const label = reactionLabels[reaction.type];

          return (
            <button
              key={reaction.type}
              type="button"
              disabled={mutation.isPending}
              aria-pressed={reaction.selectedByMe}
              data-testid={`reaction-button-${reaction.type.toLowerCase()}`}
              onClick={() => handleToggle(reaction)}
              className={`inline-flex min-w-0 items-center justify-center gap-1 whitespace-nowrap rounded-full border px-1.5 py-2 text-[11px] font-medium transition disabled:cursor-wait disabled:opacity-60 sm:px-3 sm:text-xs ${
                reaction.selectedByMe
                  ? 'border-amber/70 bg-amber/20 text-amber'
                  : 'border-white/10 bg-white/[0.07] text-mist/72 hover:border-lavender/40'
              }`}
            >
              <span
                className={`reaction-emoji-wrapper reaction-type-${reaction.type.toLowerCase()}`}
                data-emoji={label.emoji}
                aria-hidden="true"
              >
                <span className="reaction-emoji">{label.emoji}</span>
              </span>
              {' '}
              <span>{label.label}</span>
              {' '}
              <span className="tabular-nums">{reaction.count}</span>
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
