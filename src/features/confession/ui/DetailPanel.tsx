import { HeartHandshake } from 'lucide-react';
import { confessionMoodLabels, type ConfessionDetail } from '@/features/confession/model/types';
import { ReactionButtons } from '@/features/confession/ui/ReactionButtons';

type DetailPanelProps = {
  confession: ConfessionDetail;
};

export function DetailPanel({ confession }: DetailPanelProps) {
  return (
    <article className="px-5 py-6">
      <div className="rounded-3xl border border-white/10 bg-white/[0.08] p-5">
        <div className="mb-5 flex items-center justify-between">
          <span className="rounded-full bg-lavender/20 px-3 py-1 text-xs font-medium text-lavender">
            {confessionMoodLabels[confession.mood]}
          </span>
          <time className="text-xs text-mist/45">{formatFullDate(confession.createdAt)}</time>
        </div>
        <p className="whitespace-pre-wrap text-lg leading-8 text-mist">{confession.content}</p>
        <div className="mt-6 border-t border-white/10 pt-4">
          <ReactionButtons confessionId={confession.id} reactions={confession.reactions} />
        </div>
      </div>

      <section className="mt-5 rounded-3xl border border-amber/20 bg-amber/12 p-5">
        <div className="mb-3 flex items-center gap-2 text-amber">
          <HeartHandshake size={18} />
          <h2 className="font-semibold">토닥토닥</h2>
        </div>
        <p className="text-sm leading-6 text-mist/74">
          {confession.comfortMessage ?? '잘 버텨낸 마음이 여기 잠시 쉬어가도 괜찮아요.'}
        </p>
      </section>
    </article>
  );
}

function formatFullDate(value: string) {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}
