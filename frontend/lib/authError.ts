export function getFirebaseAuthErrorMessage(error: unknown): string {
  const code =
    typeof error === "object" && error !== null && "code" in error
      ? String((error as { code?: string }).code)
      : "";

  if (code === "auth/popup-closed-by-user") {
    return "Google sign-in was closed before completion.";
  }

  if (code === "auth/popup-blocked") {
    return "Popup was blocked by the browser. Enable popups and try again.";
  }

  if (code === "auth/cancelled-popup-request") {
    return "Another sign-in attempt is already in progress.";
  }

  if (code === "auth/network-request-failed") {
    return "Network error while signing in. Check your internet and try again.";
  }

  return "Unable to sign in with Google right now. Please try again.";
}
