import { Outlet } from 'react-router-dom';

export function AppLayout() {
  return (
    <main className="min-h-screen px-4 py-5 text-mist">
      <div className="mx-auto flex min-h-[calc(100vh-40px)] w-full max-w-md flex-col overflow-hidden rounded-[28px] border border-white/10 bg-midnight/86 shadow-glow backdrop-blur-xl">
        <header className="relative border-b border-white/10 px-5 pb-5 pt-6">
          <div className="absolute inset-0 opacity-[0.24]">

          </div>
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm text-lavender">Go ahead,</p>
              <h1 className="font-display text-5xl leading-none text-mist">툭</h1>
            </div>
            <div className="rounded-full border border-white/15 bg-charcoal/70 px-3 py-2 text-xs text-mist/80">
              마음을 내려놓는 소리
            </div>
          </div>
        </header>
        <Outlet />
      </div>
    </main>
  );
}
