"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useFirebaseAuth } from "../hooks/useFirebaseAuth";

type AccountMenuProps = {
  showPastQuizzes?: boolean;
};

function getEmailPreview(email: string): string {
  if (email.length <= 28) {
    return email;
  }

  const [name = "", domain = ""] = email.split("@");
  if (!domain) {
    return `${email.slice(0, 25)}...`;
  }

  return `${name.slice(0, 10)}...@${domain}`;
}

export default function AccountMenu({ showPastQuizzes = true }: AccountMenuProps) {
  const router = useRouter();
  const { user, authLoading, authActionLoading, loginWithGoogle, logout } = useFirebaseAuth();
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unable to login.";
      alert(message);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsOpen(false);
      if (window.location.pathname === "/past-quizzes") {
        router.push("/");
      }
    } catch {
      alert("Unable to logout right now. Please try again.");
    }
  };

  if (authLoading) {
    return <div className="h-10 w-10 animate-pulse rounded-full bg-white/10" />;
  }

  if (!user) {
    return (
      <button
        onClick={handleLogin}
        disabled={authActionLoading}
        className="rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {authActionLoading ? "Logging in..." : "Login"}
      </button>
    );
  }

  const avatarLabel = user.email?.charAt(0).toUpperCase() || "U";

  return (
    <div ref={rootRef} className="relative">
      <button
        onClick={() => setIsOpen((previous) => !previous)}
        aria-label="Account menu"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/20"
      >
        {avatarLabel}
      </button>

      {isOpen ? (
        <div className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-xl border border-white/15 bg-slate-950/95 shadow-xl">
          <div className="border-b border-white/10 px-4 py-3">
            <p className="text-xs text-slate-400">Signed in as</p>
            <p className="mt-1 truncate text-sm font-medium text-slate-100" title={user.email ?? ""}>
              {user.email ? getEmailPreview(user.email) : "No email"}
            </p>
          </div>

          {showPastQuizzes ? (
            <button
              onClick={() => {
                setIsOpen(false);
                router.push("/past-quizzes");
              }}
              className="w-full border-b border-white/10 px-4 py-3 text-left text-sm text-slate-100 transition hover:bg-white/10"
            >
              Past Quizzes
            </button>
          ) : null}

          <button
            onClick={handleLogout}
            disabled={authActionLoading}
            className="w-full px-4 py-3 text-left text-sm text-red-300 transition hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {authActionLoading ? "Logging out..." : "Logout"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
