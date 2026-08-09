"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface PublicReview {
  id: string;
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

interface PublicReviewsProps {
  mediaId: number;
}

interface ReviewResponse {
  reviews: PublicReview[];
  stats: {
    count: number;
    average: number | null;
  };
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
  }).format(new Date(value));
}

function formatRating(value: number) {
  return Number(value).toFixed(1);
}

export function PublicReviews({
  mediaId,
}: PublicReviewsProps) {
  const [data, setData] =
    useState<ReviewResponse | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReviews() {
      try {
        const response = await fetch(
          `/api/reviews?mediaId=${mediaId}`,
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

    loadReviews();
  }, [mediaId]);

  if (loading) {
    return (
      <section className="mt-10">
        <p className="text-sm text-[var(--muted)]">
          Chargement des avis...
        </p>
      </section>
    );
  }

  const reviews = data?.reviews ?? [];
  const average = data?.stats.average ?? null;
  const count = data?.stats.count ?? 0;

  return (
    <section className="mt-12 border-t border-[var(--border)] pt-12">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-[var(--accent)]">
            Communauté
          </p>

          <h2 className="mt-2 text-3xl font-bold text-white">
            Les avis Akari
          </h2>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-6 py-4">
          <p className="text-xs uppercase tracking-wider text-[var(--muted)]">
            Note Akari
          </p>

          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">
              {average !== null
                ? formatRating(average)
                : "—"}
            </span>

            <span className="text-sm text-[var(--muted)]">
              / 5 · {count}{" "}
              {count === 1 ? "avis" : "avis"}
            </span>
          </div>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-[var(--border)] px-6 py-12 text-center">
          <p className="text-white">
            Aucun avis pour le moment.
          </p>

          <p className="mt-2 text-sm text-[var(--muted)]">
            Soyez le premier à noter cette œuvre.
          </p>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {reviews.map((review) => (
            <article
              key={review.id}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <Link
                  href={`/users/${review.profiles.username}`}
                  className="flex items-center gap-3"
                >
                  <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-[var(--surface-hover)] text-sm font-bold text-white">
                    {review.profiles.avatar_url ? (
                      <img
                        src={review.profiles.avatar_url}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      review.profiles.username
                        .charAt(0)
                        .toUpperCase()
                    )}
                  </div>

                  <div>
                    <p className="font-medium text-white">
                      {review.profiles.display_name ||
                        review.profiles.username}
                    </p>

                    <p className="text-sm text-[var(--muted)]">
                      @{review.profiles.username}
                    </p>
                  </div>
                </Link>

                <div className="text-right">
                  <p className="font-semibold text-[var(--accent)]">
                    {formatRating(
                      Number(review.rating),
                    )}
                    /5
                  </p>

                  <p className="mt-1 text-xs text-[var(--muted)]">
                    {formatDate(review.created_at)}
                  </p>
                </div>
              </div>

              {review.content && (
                <p className="mt-5 whitespace-pre-wrap leading-7 text-[var(--muted)]">
                  {review.content}
                </p>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}