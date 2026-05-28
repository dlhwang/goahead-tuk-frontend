export type ConfessionMood = 'tired' | 'lonely' | 'sorry' | 'hopeful';

export const reactionTypes = ['PRAY', 'COMFORT', 'TOGETHER'] as const;

export type ReactionType = (typeof reactionTypes)[number];

export type ConfessionReaction = {
  type: ReactionType;
  count: number;
  selectedByMe: boolean;
};

export const reactionLabels: Record<ReactionType, { emoji: string; label: string }> = {
  PRAY: { emoji: '🙏', label: '기도해요' },
  COMFORT: { emoji: '🫂', label: '토닥여요' },
  TOGETHER: { emoji: '🤝', label: '함께해요' },
};

export function normalizeConfessionReactions(
  reactions: readonly ConfessionReaction[] = [],
): ConfessionReaction[] {
  return reactionTypes.map((type) => {
    const reaction = reactions.find((candidate) => candidate.type === type);

    return reaction ?? { type, count: 0, selectedByMe: false };
  });
}

export type Confession = {
  id: string;
  content: string;
  mood: ConfessionMood;
  createdAt: string;
  reactions?: ConfessionReaction[];
};

export type ConfessionDetail = Confession & {
  comfortMessage?: string;
};

export type CreateConfessionPayload = {
  content: string;
  mood: ConfessionMood;
};

export const confessionMoodLabels: Record<ConfessionMood, string> = {
  tired: '지쳤어요',
  lonely: '외로워요',
  sorry: '미안해요',
  hopeful: '괜찮아질래요',
};
