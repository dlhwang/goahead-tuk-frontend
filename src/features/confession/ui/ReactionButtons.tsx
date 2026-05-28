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
      <div className="flex flex-wrap gap-2" aria-label="반응 선택">
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
              className={`rounded-full border px-3 py-2 text-xs font-medium transition disabled:cursor-wait disabled:opacity-60 ${
                reaction.selectedByMe
                  ? 'border-amber/70 bg-amber/20 text-amber'
                  : 'border-white/10 bg-white/[0.07] text-mist/72 hover:border-lavender/40'
              }`}
            >
              <span aria-hidden="true">{label.emoji}</span> {label.label} {reaction.count}
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
