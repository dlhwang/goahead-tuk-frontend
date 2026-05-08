import { useMemo, useState } from 'react';
import { Send } from 'lucide-react';
import {
  confessionMoodLabels,
  type ConfessionMood,
  type CreateConfessionPayload,
} from '@/features/confession/model/types';

const moods = Object.keys(confessionMoodLabels) as ConfessionMood[];

type ConfessionFormProps = {
  isSubmitting: boolean;
  onSubmit: (payload: CreateConfessionPayload) => void;
};

export function ConfessionForm({ isSubmitting, onSubmit }: ConfessionFormProps) {
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<ConfessionMood>('tired');

  const remainingCount = useMemo(() => 280 - content.length, [content.length]);
  const canSubmit = content.trim().length >= 4 && remainingCount >= 0 && !isSubmitting;

  return (
    <form
      className="flex flex-1 flex-col gap-5 px-5 py-6"
      onSubmit={(event) => {
        event.preventDefault();
        if (canSubmit) {
          onSubmit({ content: content.trim(), mood });
        }
      }}
    >
      <section>
        <label className="mb-3 block text-sm font-medium text-mist/74" htmlFor="confession-content">
          오늘의 마음
        </label>
        <textarea
          id="confession-content"
          value={content}
          maxLength={280}
          onChange={(event) => setContent(event.target.value)}
          placeholder="혼자서만 들고 있던 마음을 툭 내려놓아 보세요."
          className="min-h-52 w-full resize-none rounded-3xl border border-white/12 bg-white/[0.08] px-4 py-4 text-base leading-7 text-mist outline-none placeholder:text-mist/36 focus:border-lavender/60"
        />
        <p className="mt-2 text-right text-xs text-mist/45">{remainingCount}자</p>
      </section>

      <section>
        <p className="mb-3 text-sm font-medium text-mist/74">지금 감정</p>
        <div className="grid grid-cols-2 gap-2">
          {moods.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setMood(item)}
              className={`rounded-2xl border px-3 py-3 text-sm transition ${
                mood === item
                  ? 'border-amber bg-amber text-midnight'
                  : 'border-white/10 bg-white/[0.07] text-mist/72'
              }`}
            >
              {confessionMoodLabels[item]}
            </button>
          ))}
        </div>
      </section>

      <button
        type="submit"
        disabled={!canSubmit}
        className="mt-auto inline-flex h-14 items-center justify-center gap-2 rounded-full bg-mist px-5 font-semibold text-midnight transition enabled:active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-mist/32 disabled:text-midnight/50"
      >
        <Send size={18} />
        툭 보내기
      </button>
    </form>
  );
}
