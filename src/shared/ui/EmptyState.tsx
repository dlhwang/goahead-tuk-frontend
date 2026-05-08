import type { ReactNode } from 'react';

type EmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <section className="flex flex-1 flex-col items-center justify-center px-7 py-12 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-lavender/30 bg-lavender/14 text-3xl">
        툭
      </div>
      <h2 className="text-xl font-semibold text-mist">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-mist/64">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </section>
  );
}
