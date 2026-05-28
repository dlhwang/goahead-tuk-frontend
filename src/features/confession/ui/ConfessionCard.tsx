import { Link } from 'react-router-dom';
import { confessionMoodLabels, type Confession } from '@/features/confession/model/types';
import { ReactionButtons } from '@/features/confession/ui/ReactionButtons';

type ConfessionCardProps = {
  confession: Confession;
};

export function ConfessionCard({ confession }: ConfessionCardProps) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.08] p-4 shadow-lg shadow-black/10">
      <Link
        to={`/confessions/${confession.id}`}
        className="block transition active:scale-[0.99]"
      >
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="rounded-full bg-lavender/20 px-3 py-1 text-xs font-medium text-lavender">
            {confessionMoodLabels[confession.mood]}
          </span>
          <time className="text-xs text-mist/45">{formatDate(confession.createdAt)}</time>
        </div>
        <p className="line-clamp-3 text-[15px] leading-6 text-mist/88">{confession.content}</p>
      </Link>
      <div className="mt-4">
        <ReactionButtons confessionId={confession.id} reactions={confession.reactions} />
      </div>
    </article>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('ko-KR', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(value));
}
