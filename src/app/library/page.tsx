"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface LibraryEntry {
  id: string;
  media_id: number;
  status:
    | "planned"
    | "in_progress"
    | "completed"
    | "paused"
    | "dropped";
  updated_at: string;
}

interface LibraryResponse {
  entries: LibraryEntry[];
  counts: {
    planned: number;
    in_progress: number;
    completed: number;
    paused: number;
    dropped: number;
  };
}

const statusLabels = {
  planned: "À voir / À lire",
  in_progress: "En cours",
  completed: "Terminé",
  paused: "En pause",
  dropped: "Abandonné",
};

export default function LibraryPage() {
  const [data, setData] =
    useState<LibraryResponse | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLibrary() {
      try {
        const response = await fetch(
          "/api/library",
        );

        if (!response.ok) {
          return;
        }

        const result = await response.json();

        setData(result);
      } finally {
        setLoading(false);
      }
    }

    loadLibrary();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-[var(--background)] px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <p className="text-[var(--muted)]">
            Chargement de votre bibliothèque...
          </p>
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen bg-[var(--background)] px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-3xl font-bold text-white">
            Ma bibliothèque
          </h1>

          <p className="mt-3 text-[var(--muted)]">
            Connectez-vous pour retrouver vos œuvres.
          </p>

          <Link
            href="/login"
            className="mt-6 inline-block rounded-xl bg-[var(--accent)] px-5 py-3 font-medium text-white"
          >
            Se connecter
          </Link>
        </div>
      </main>
    );
  }

  const statusCards = Object.entries(
    data.counts,
  ) as [
    keyof typeof data.counts,
    number,
  ][];

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <p className="text-sm font-medium uppercase tracking-wider text-[var(--accent)]">
          Ma bibliothèque
        </p>

        <h1 className="mt-2 text-4xl font-bold text-white">
          Mes œuvres
        </h1>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {statusCards.map(
            ([status, count]) => (
              <div
                key={status}
                className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5"
              >
                <p className="text-3xl font-bold text-white">
                  {count}
                </p>

                <p className="mt-2 text-sm text-[var(--muted)]">
                  {statusLabels[status]}
                </p>
              </div>
            ),
          )}
        </div>

        <section className="mt-12">
          {data.entries.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[var(--border)] p-12 text-center">
              <h2 className="text-xl font-semibold text-white">
                Votre bibliothèque est vide.
              </h2>

              <p className="mt-2 text-[var(--muted)]">
                Explorez Akari et ajoutez votre première
                œuvre.
              </p>

              <Link
                href="/search"
                className="mt-6 inline-block rounded-xl bg-[var(--accent)] px-5 py-3 font-medium text-white"
              >
                Explorer
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {data.entries.map((entry) => (
                <Link
                  key={entry.id}
                  href={`/media/${entry.media_id}`}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 transition-colors hover:border-[var(--accent)]"
                >
                  <p className="text-lg font-semibold text-white">
                    Œuvre #{entry.media_id}
                  </p>

                  <p className="mt-2 text-sm text-[var(--accent)]">
                    {statusLabels[entry.status]}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}