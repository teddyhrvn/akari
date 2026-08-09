"use client";

import { useEffect, useState } from "react";

interface ReviewFormProps {
  mediaId: number;
}

interface Review {
  id: string;
  rating: number;
  content: string | null;
}

export function ReviewForm({
  mediaId,
}: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");

  const [review, setReview] =
    useState<Review | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadReview() {
      try {
        const response = await fetch(
          `/api/reviews/${mediaId}`,
        );

        if (!response.ok) {
          return;
        }

        const data = await response.json();

        if (data.review) {
          setReview(data.review);
          setRating(data.review.rating);
          setContent(data.review.content ?? "");
        }
      } finally {
        setLoading(false);
      }
    }

    loadReview();
  }, [mediaId]);

  async function saveReview() {
    if (rating < 0.5) {
      setMessage("Choisissez une note.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mediaId,
          rating,
          content,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.error ??
            "Impossible d'enregistrer votre avis.",
        );

        return;
      }

      setReview(data.review);

      setMessage("Votre avis a été enregistré.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteReview() {
    setSaving(true);
    setMessage("");

    try {
      const response = await fetch(
        `/api/reviews?mediaId=${mediaId}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        setMessage(
          "Impossible de supprimer votre avis.",
        );

        return;
      }

      setReview(null);
      setRating(0);
      setContent("");

      setMessage("Votre avis a été supprimé.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="mt-10 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <p className="text-sm text-[var(--muted)]">
          Chargement de votre note...
        </p>
      </div>
    );
  }

  return (
    <section className="mt-10 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-wider text-[var(--accent)]">
          Votre avis
        </p>

        <h2 className="mt-2 text-2xl font-bold text-white">
          {review
            ? "Votre note"
            : "Vous avez vu / lu cette œuvre ?"}
        </h2>
      </div>

      <div className="mt-6">
        <div
          className="flex flex-wrap gap-2"
          aria-label="Choisir une note"
        >
          {[0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map(
            (value) => (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                className={`rounded-lg border px-3 py-2 text-sm transition-colors ${
                  rating === value
                    ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                    : "border-[var(--border)] text-[var(--muted)] hover:text-white"
                }`}
              >
                {value}
              </button>
            ),
          )}
        </div>

        <p className="mt-3 text-sm text-[var(--muted)]">
          Note sélectionnée :{" "}
          <span className="font-medium text-white">
            {rating > 0 ? `${rating}/5` : "Aucune"}
          </span>
        </p>
      </div>

      <div className="mt-6">
        <label
          htmlFor="review-content"
          className="mb-2 block text-sm font-medium text-white"
        >
          Votre avis
        </label>

        <textarea
          id="review-content"
          value={content}
          onChange={(event) =>
            setContent(event.target.value)
          }
          rows={5}
          maxLength={2000}
          placeholder="Qu'avez-vous pensé de cette œuvre ?"
          className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-white outline-none placeholder:text-[var(--muted)] focus:border-[var(--accent)]"
        />

        <p className="mt-2 text-right text-xs text-[var(--muted)]">
          {content.length}/2000
        </p>
      </div>

      {message && (
        <p className="mt-4 text-sm text-[var(--muted)]">
          {message}
        </p>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={saveReview}
          disabled={saving}
          className="rounded-xl bg-[var(--accent)] px-6 py-3 font-medium text-white transition-colors hover:bg-[var(--accent-hover)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving
            ? "Enregistrement..."
            : review
              ? "Modifier mon avis"
              : "Publier mon avis"}
        </button>

        {review && (
          <button
            type="button"
            onClick={deleteReview}
            disabled={saving}
            className="rounded-xl border border-[var(--border)] px-6 py-3 font-medium text-[var(--muted)] transition-colors hover:text-white disabled:opacity-50"
          >
            Supprimer
          </button>
        )}
      </div>
    </section>
  );
}