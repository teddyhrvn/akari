"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Activity {
  id: string;
  media_id: number;
  rating: number;
  content: string | null;
  created_at: string;
  profiles: {
    id: string;
    username: string;
    display_name: string | null;
    avatar_url: string | null;
  };
}

export function ActivityFeed() {
  const [activities, setActivities] =
    useState<Activity[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeed() {
      try {
        const response = await fetch(
          "/api/feed",
        );

        if (!response.ok) {
          return;
        }

        const data = await response.json();

        setActivities(data.activities ?? []);
      } finally {
        setLoading(false);
      }
    }

    loadFeed();
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <p className="text-sm text-[var(--muted)]">
          Chargement de votre activité...
        </p>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[var(--border)] p-10 text-center">
        <p className="text-lg font-medium text-white">
          Votre feed est encore vide.
        </p>

        <p className="mt-2 text-sm text-[var(--muted)]">
          Suivez des utilisateurs pour voir leurs
          nouvelles notes ici.
        </p>

        <Link
          href="/search"
          className="mt-6 inline-block rounded-xl bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[var(--accent-hover)]"
        >
          Découvrir Akari
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <article
          key={activity.id}
          className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6"
        >
          <div className="flex items-start gap-4">
            <Link
              href={`/users/${activity.profiles.username}`}
              className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--surface-hover)] font-bold text-white"
            >
              {activity.profiles.avatar_url ? (
                <img
                  src={activity.profiles.avatar_url}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                activity.profiles.username
                  .charAt(0)
                  .toUpperCase()
              )}
            </Link>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-white">
                  <Link
                    href={`/users/${activity.profiles.username}`}
                    className="font-semibold hover:text-[var(--accent)]"
                  >
                    {activity.profiles.display_name ||
                      activity.profiles.username}
                  </Link>{" "}
                  a noté une œuvre
                </p>

                <span className="font-semibold text-[var(--accent)]">
                  {Number(activity.rating).toFixed(1)}
                  /5
                </span>
              </div>

              <p className="mt-1 text-sm text-[var(--muted)]">
                @{activity.profiles.username}
              </p>

              {activity.content && (
                <p className="mt-4 leading-7 text-[var(--muted)]">
                  {activity.content}
                </p>
              )}

              <Link
                href={`/media/${activity.media_id}`}
                className="mt-4 inline-block text-sm font-medium text-[var(--accent)] hover:underline"
              >
                Voir l'œuvre →
              </Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}