import { describe, expect, it } from 'vitest';
import fc from 'fast-check';
import {
  normalizeConfessionReactions,
  reactionTypes,
  type ConfessionReaction,
} from '@/features/confession/model/types';

const reactionArbitrary = fc.record({
  type: fc.constantFrom(...reactionTypes),
  count: fc.nat(),
  selectedByMe: fc.boolean(),
});

const reactionListArbitrary = fc
  .array(reactionArbitrary, { maxLength: reactionTypes.length })
  .filter((reactions) => new Set(reactions.map((reaction) => reaction.type)).size === reactions.length);

describe('normalizeConfessionReactions', () => {
  it('provides defaults for missing reaction types', () => {
    expect(normalizeConfessionReactions([{ type: 'COMFORT', count: 2, selectedByMe: true }])).toEqual([
      { type: 'PRAY', count: 0, selectedByMe: false },
      { type: 'COMFORT', count: 2, selectedByMe: true },
      { type: 'TOGETHER', count: 0, selectedByMe: false },
    ]);
  });

  it('always returns all reaction types in display order while preserving response values', () => {
    fc.assert(
      fc.property(reactionListArbitrary, (reactions: ConfessionReaction[]) => {
        const normalized = normalizeConfessionReactions(reactions);

        expect(normalized.map((reaction) => reaction.type)).toEqual(reactionTypes);

        for (const type of reactionTypes) {
          const source = reactions.find((reaction) => reaction.type === type);
          const result = normalized.find((reaction) => reaction.type === type);

          expect(result).toEqual(source ?? { type, count: 0, selectedByMe: false });
        }
      }),
    );
  });
});
