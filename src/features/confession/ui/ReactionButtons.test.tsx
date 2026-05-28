import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { useConfessionReactionMutation } from '@/features/confession/api/confessionQueries';
import { ReactionButtons } from '@/features/confession/ui/ReactionButtons';

vi.mock('@/features/confession/api/confessionQueries', () => ({
  useConfessionReactionMutation: vi.fn(),
}));

const mutate = vi.fn();
const reset = vi.fn();

function mockMutationState(isPending = false, isError = false) {
  vi.mocked(useConfessionReactionMutation).mockReturnValue({
    mutate,
    reset,
    isPending,
    isError,
  } as unknown as ReturnType<typeof useConfessionReactionMutation>);
}

describe('ReactionButtons', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockMutationState();
  });

  it('always renders three reaction buttons with missing counts defaulted to zero', () => {
    render(
      <ReactionButtons
        confessionId="confession-1"
        reactions={[{ type: 'PRAY', count: 3, selectedByMe: true }]}
      />,
    );

    expect(screen.getByTestId('reaction-button-pray')).toHaveTextContent('기도해요 3');
    expect(screen.getByTestId('reaction-button-pray')).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByTestId('reaction-button-comfort')).toHaveTextContent('토닥여요 0');
    expect(screen.getByTestId('reaction-button-together')).toHaveTextContent('함께해요 0');
  });

  it('uses the server selection state to request select or deselect', () => {
    render(
      <ReactionButtons
        confessionId="confession-1"
        reactions={[
          { type: 'PRAY', count: 3, selectedByMe: true },
          { type: 'COMFORT', count: 1, selectedByMe: false },
        ]}
      />,
    );

    fireEvent.click(screen.getByTestId('reaction-button-pray'));
    expect(mutate).toHaveBeenLastCalledWith({ type: 'PRAY', selected: true });

    fireEvent.click(screen.getByTestId('reaction-button-comfort'));
    expect(mutate).toHaveBeenLastCalledWith({ type: 'COMFORT', selected: false });
    expect(reset).toHaveBeenCalledTimes(2);
  });

  it('disables all reaction buttons while a mutation is pending', () => {
    mockMutationState(true);
    render(<ReactionButtons confessionId="confession-1" />);

    expect(screen.getByTestId('reaction-button-pray')).toBeDisabled();
    expect(screen.getByTestId('reaction-button-comfort')).toBeDisabled();
    expect(screen.getByTestId('reaction-button-together')).toBeDisabled();
  });

  it('shows a retryable accessible error message after mutation failure', () => {
    mockMutationState(false, true);
    render(<ReactionButtons confessionId="confession-1" />);

    expect(screen.getByRole('alert')).toHaveTextContent(
      '반응을 처리하지 못했어요. 잠시 후 다시 시도해 주세요.',
    );
  });
});
