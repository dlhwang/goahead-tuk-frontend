import { Link } from 'react-router-dom';
import { PenLine, RefreshCw } from 'lucide-react';
import { useConfessionsQuery } from '@/features/confession/api/confessionQueries';
import { ConfessionCard } from '@/features/confession/ui/ConfessionCard';
import { EmptyState } from '@/shared/ui/EmptyState';

export function ConfessionListPage() {
  const { data: confessions, isError, isLoading, refetch, isFetching } = useConfessionsQuery();

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center justify-between px-5 py-4">
        <div>
          <h2 className="text-lg font-semibold">고해 목록</h2>
          <p className="mt-1 text-xs text-mist/50">이름 없이 내려놓은 마음들</p>
        </div>
        <button
          type="button"
          onClick={() => void refetch()}
          aria-label="새로고침"
          className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.07] text-mist/72"
        >
          <RefreshCw size={17} className={isFetching ? 'animate-spin' : ''} />
        </button>
      </div>

      {isLoading ? <LoadingList /> : null}

      {isError ? (
        <EmptyState
          title="마음을 불러오지 못했어요"
          description="잠시 뒤 다시 시도해 주세요."
          action={<RetryButton onClick={() => void refetch()} />}
        />
      ) : null}

      {confessions?.length === 0 ? (
        <EmptyState
          title="아직 내려놓은 마음이 없어요"
          description="첫 번째 고해를 남기고 가볍게 시작해 보세요."
          action={<CreateLink />}
        />
      ) : null}

      {confessions && confessions.length > 0 ? (
        <section className="grid gap-3 px-5 pb-24">
          {confessions.map((confession) => (
            <ConfessionCard key={confession.id} confession={confession} />
          ))}
        </section>
      ) : null}

      <Link
        to="/confessions/new"
        className="fixed bottom-7 left-1/2 inline-flex h-14 w-[calc(100%-40px)] max-w-sm -translate-x-1/2 items-center justify-center gap-2 rounded-full bg-mist font-semibold text-midnight shadow-2xl shadow-black/30 active:scale-[0.98]"
      >
        <PenLine size={18} /> 고해하기
      </Link>
    </div>
  );
}

function LoadingList() {
  return (
    <section className="grid gap-3 px-5 pb-24">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="h-36 animate-pulse rounded-2xl bg-white/[0.08]" />
      ))}
    </section>
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

function CreateLink() {
  return (
    <Link to="/confessions/new" className="rounded-full bg-mist px-5 py-3 text-sm font-semibold text-midnight">
      고해 쓰기
    </Link>
  );
}
