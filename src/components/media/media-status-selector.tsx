"use client";

import { useEffect, useState } from "react";

interface MediaStatusSelectorProps {
  mediaId: number;
}

const statuses = [
  {
    value: "planned",
    label: "À voir / À lire",
  },
  {
    value: "in_progress",
    label: "En cours",
  },
  {
    value: "completed",
    label: "Terminé",
  },
  {
    value: "paused",
    label: "En pause",
  },
  {
    value: "dropped",
    label: "Abandonné",
  },
] as const;

type MediaStatus =
  (typeof statuses)[number]["value"];

export function MediaStatusSelector({
  mediaId,
}: MediaStatusSelectorProps) {
  const [status, setStatus] =
    useState<MediaStatus | null>(null);

  const [authenticated, setAuthenticated] =
    useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadStatus() {
      try {
        const response = await fetch(
          `/api/media-status?mediaId=${mediaId}`,
        );

        if (!response.ok) {
          return;
        }

        const data = await response.json();

        setAuthenticated(
          data.authenticated,
        );

        setStatus(
          data.entry?.status ?? null,
        );
      } finally {
        setLoading(false);
      }
    }

    loadStatus();
  }, [mediaId]);

  async function updateStatus(
    nextStatus: MediaStatus,
  ) {
    setSaving(true);

    try {
      const response = await fetch(
        "/api/media-status",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mediaId,
            status: nextStatus,
          }),
        },
      );

      if (!response.ok) {
        return;
      }

      setStatus(nextStatus);
    } finally {
      setSaving(false);
    }
  }

  async function removeStatus() {
    setSaving(true);

    try {
      const response = await fetch(
        `/api/media-status?mediaId=${mediaId}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        return;
      }

      setStatus(null);
    } finally {
      setSaving(false);
    }
  }

  if (
    loading ||
    !authenticated
  ) {
    return null;
  }

  return (
    <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
      <p className="text-sm font-medium uppercase tracking-wider text-[var(--accent)]">
        Ma liste
      </p>

      <h2 className="mt-2 text-xl font-bold text-white">
        Que voulez-vous faire de cette œuvre ?
      </h2>

      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        {statuses.map((item) => (
          <button
            key={item.value}
            type="button"
            disabled={saving}
            onClick={() =>
              updateStatus(item.value)
            }
            className={`rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
              status === item.value
                ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                : "border-[var(--border)] text-[var(--muted)] hover:text-white"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {status && (
        <button
          type="button"
          disabled={saving}
          onClick={removeStatus}
          className="mt-4 text-sm text-[var(--muted)] hover:text-white"
        >
          Retirer de ma liste
        </button>
      )}
    </section>
  );
}