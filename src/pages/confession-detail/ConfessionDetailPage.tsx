import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, PenLine } from 'lucide-react';
import { useConfessionDetailQuery } from '@/features/confession/api/confessionQueries';
import { DetailPanel } from '@/features/confession/ui/DetailPanel';
import { EmptyState } from '@/shared/ui/EmptyState';

export function ConfessionDetailPage() {
  const navigate = useNavigate();
  const { confessionId = '' } = useParams();
  const { data: confession, isError, isLoading, refetch } = useConfessionDetailQuery(confessionId);

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center justify-between px-5 py-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="뒤로 가기"
          className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.07] text-mist/72"
        >
          <ArrowLeft size={18} />
        </button>
        <Link
          to="/confessions/new"
          className="inline-flex h-10 items-center gap-2 rounded-full bg-white/[0.07] px-4 text-sm text-mist/74"
        >
          <PenLine size={15} /> 새 고해
        </Link>
      </div>

      {isLoading ? <div className="mx-5 h-80 animate-pulse rounded-3xl bg-white/[0.08]" /> : null}

      {isError ? (
        <EmptyState
          title="고해를 찾지 못했어요"
          description="삭제되었거나 잠시 연결이 불안정할 수 있어요."
          action={<RetryButton onClick={() => void refetch()} />}
        />
      ) : null}

      {confession ? <DetailPanel confession={confession} /> : null}
    </div>
  );
}

function RetryButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full bg-mist px-5 py-3 text-sm font-semibold text-midnight"
    >
      다시 시도
    </button>
  );
}
