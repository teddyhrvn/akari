"use client";

import { useEffect, useState } from "react";

interface FollowButtonProps {
  userId: string;
}

export function FollowButton({
  userId,
}: FollowButtonProps) {
  const [following, setFollowing] =
    useState(false);

  const [authenticated, setAuthenticated] =
    useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadStatus() {
      try {
        const response = await fetch(
          `/api/follows/status?followingId=${userId}`,
        );

        if (!response.ok) {
          return;
        }

        const data = await response.json();

        setAuthenticated(data.authenticated);
        setFollowing(data.following);
      } finally {
        setLoading(false);
      }
    }

    loadStatus();
  }, [userId]);

  async function toggleFollow() {
    setSaving(true);

    try {
      const response = await fetch(
        `/api/follows${
          following
            ? `?followingId=${userId}`
            : ""
        }`,
        {
          method: following
            ? "DELETE"
            : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: following
            ? undefined
            : JSON.stringify({
                followingId: userId,
              }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        return;
      }

      setFollowing(data.following);
    } finally {
      setSaving(false);
    }
  }

  if (loading || !authenticated) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={toggleFollow}
      disabled={saving}
      className={`rounded-xl px-5 py-2.5 text-sm font-medium transition-colors disabled:opacity-50 ${
        following
          ? "border border-[var(--border)] text-[var(--muted)] hover:text-white"
          : "bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]"
      }`}
    >
      {saving
        ? "..."
        : following
          ? "Ne plus suivre"
          : "Suivre"}
    </button>
  );
}