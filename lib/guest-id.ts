"use client";

export function getGuestId(): string {
  if (typeof window === "undefined") return "";

  const stored = window.localStorage.getItem("moneylabs-guest-id");
  if (stored) return stored;

  const id = crypto.randomUUID();
  window.localStorage.setItem("moneylabs-guest-id", id);
  return id;
}
