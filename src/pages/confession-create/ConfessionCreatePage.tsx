import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useCreateConfessionMutation } from '@/features/confession/api/confessionQueries';
import { ConfessionForm } from '@/features/confession/ui/ConfessionForm';

export function ConfessionCreatePage() {
  const navigate = useNavigate();
  const { mutate, isPending, isError } = useCreateConfessionMutation();

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center gap-3 px-5 py-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="뒤로 가기"
          className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.07] text-mist/72"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2 className="text-lg font-semibold">고해 작성</h2>
          <p className="mt-1 text-xs text-mist/50">마음에 걸린 것을 조용히 내려놓기</p>
        </div>
      </div>

      {isError ? (
        <p className="mx-5 rounded-2xl border border-amber/25 bg-amber/12 px-4 py-3 text-sm text-amber">
          전송하지 못했어요. 네트워크를 확인한 뒤 다시 시도해 주세요.
        </p>
      ) : null}

      <ConfessionForm
        isSubmitting={isPending}
        onSubmit={(payload) =>
          mutate(payload, {
            onSuccess: (createdConfession) => {
              navigate(`/confessions/${createdConfession.id}`);
            },
          })
        }
      />
    </div>
  );
}
