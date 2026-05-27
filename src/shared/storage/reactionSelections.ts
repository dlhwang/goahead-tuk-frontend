import { reactionTypes, type ReactionType } from '@/features/confession/model/types';

const REACTION_SELECTIONS_KEY = 'goahead-tuk.reaction-selections';

type ReactionSelections = Record<string, ReactionType[]>;

export function getSelectedReactions(confessionId: string): ReactionType[] {
  return readSelections()[confessionId] ?? [];
}

export function setSelectedReaction(
  confessionId: string,
  type: ReactionType,
  selected: boolean,
): ReactionType[] {
  const selections = readSelections();
  const current = new Set(selections[confessionId] ?? []);

  if (selected) {
    current.add(type);
  } else {
    current.delete(type);
  }

  const updated = [...current];
  selections[confessionId] = updated;
  window.localStorage.setItem(REACTION_SELECTIONS_KEY, JSON.stringify(selections));
  return updated;
}

function readSelections(): ReactionSelections {
  try {
    const saved = window.localStorage.getItem(REACTION_SELECTIONS_KEY);
    if (!saved) {
      return {};
    }

    const parsed = JSON.parse(saved) as Record<string, unknown>;
    return Object.fromEntries(
      Object.entries(parsed).map(([confessionId, values]) => [
        confessionId,
        Array.isArray(values)
          ? values.filter((value): value is ReactionType =>
              reactionTypes.includes(value as ReactionType),
            )
          : [],
      ]),
    );
  } catch {
    return {};
  }
}
