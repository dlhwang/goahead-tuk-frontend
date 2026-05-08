import { Link } from 'react-router-dom';
import { MessageCircle, Heart } from 'lucide-react';
import { confessionMoodLabels, type Confession } from '@/features/confession/model/types';

type ConfessionCardProps = {
  confession: Confession;
};

export function ConfessionCard({ confession }: ConfessionCardProps) {
  return (
    <Link
      to={`/confessions/${confession.id}`}
      className="block rounded-2xl border border-white/10 bg-white/[0.08] p-4 shadow-lg shadow-black/10 transition active:scale-[0.99]"
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="rounded-full bg-lavender/20 px-3 py-1 text-xs font-medium text-lavender">
          {confessionMoodLabels[confession.mood]}
        </span>
        <time className="text-xs text-mist/45">{formatDate(confession.createdAt)}</time>
      </div>
      <p className="line-clamp-3 text-[15px] leading-6 text-mist/88">{confession.content}</p>
      <div className="mt-4 flex items-center gap-4 text-xs text-mist/52">
        <span className="inline-flex items-center gap-1.5">
          <MessageCircle size={14} />
          들어줌
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Heart size={14} />
          {confession.reactionCount}
        </span>
      </div>
    </Link>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('ko-KR', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(value));
}
