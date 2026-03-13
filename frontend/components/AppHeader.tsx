"use client";

import React from "react";
import { useRouter } from "next/navigation";
import AccountMenu from "./AccountMenu";

type AppHeaderProps = {
  backHref?: string;
  backLabel?: string;
  hidePastQuizzesInMenu?: boolean;
};

export default function AppHeader({
  backHref,
  backLabel = "Back to Home",
  hidePastQuizzesInMenu = false,
}: AppHeaderProps) {
  const router = useRouter();

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40">
      <div className="pointer-events-auto mx-auto flex w-full max-w-6xl items-center justify-between px-4 pt-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          {backHref ? (
            <button
              onClick={() => router.push(backHref)}
              className="rounded-lg border border-white/20 bg-black/25 px-3 py-1.5 text-xs text-slate-100 transition hover:bg-black/40"
            >
              {backLabel}
            </button>
          ) : null}
        </div>

        <AccountMenu showPastQuizzes={!hidePastQuizzesInMenu} />
      </div>
    </header>
  );
}
