export type ConfessionMood = 'tired' | 'lonely' | 'sorry' | 'hopeful';

export type Confession = {
  id: string;
  content: string;
  mood: ConfessionMood;
  createdAt: string;
  reactionCount: number;
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
