import Link from "next/link";
import type { Media } from "@/types/anime";
import { ReviewForm } from "@/components/reviews/review-form";

interface MediaPageProps {
  params: Promise<{
    id: string;
  }>;
}

function getTitle(media: Media) {
  return (
    media.title.english ||
    media.title.romaji ||
    media.title.native ||
    "Titre inconnu"
  );
}

function getTypeLabel(media: Media) {
  return media.type === "ANIME" ? "Anime" : "Manga";
}

function getStatusLabel(media: Media) {
  switch (media.status) {
    case "FINISHED":
      return "Terminé";

    case "RELEASING":
      return "En cours";

    case "NOT_YET_RELEASED":
      return "À venir";

    case "CANCELLED":
      return "Annulé";

    case "HIATUS":
      return "En pause";

    default:
      return "Inconnu";
  }
}

function stripHtml(text: string | null) {
  if (!text) {
    return "Aucun synopsis disponible.";
  }

  return text.replace(/<[^>]*>/g, "");
}

async function getMedia(id: string): Promise<Media | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/media/${id}`,
      {
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erreur lors de la récupération du média:", error);
    return null;
  }
}

export default async function MediaPage({
  params,
}: MediaPageProps) {
  const { id } = await params;
  const media = await getMedia(id);

  if (!media) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--background)] px-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">
            Œuvre introuvable
          </h1>

          <Link
            href="/search"
            className="mt-6 inline-block text-[var(--accent)]"
          >
            Retour à la recherche
          </Link>
        </div>
      </main>
    );
  }

  const title = getTitle(media);

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <Link
          href="/search"
          className="text-sm text-[var(--muted)] transition-colors hover:text-white"
        >
          ← Retour à la recherche
        </Link>

        <div className="mt-10 grid gap-10 md:grid-cols-[280px_1fr]">
          <div>
            <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
              {media.cover.extraLarge && (
                <img
                  src={media.cover.extraLarge}
                  alt={title}
                  className="w-full"
                />
              )}
            </div>
          </div>

          <div>
            <div className="flex flex-wrap gap-2 text-sm">
              <span className="rounded-full bg-[var(--surface)] px-3 py-1 text-[var(--accent)]">
                {getTypeLabel(media)}
              </span>

              {media.format && (
                <span className="rounded-full bg-[var(--surface)] px-3 py-1 text-[var(--muted)]">
                  {media.format}
                </span>
              )}

              {media.status && (
                <span className="rounded-full bg-[var(--surface)] px-3 py-1 text-[var(--muted)]">
                  {getStatusLabel(media)}
                </span>
              )}
            </div>

            <h1 className="mt-5 text-4xl font-bold tracking-tight text-white md:text-5xl">
              {title}
            </h1>

            {media.title.native &&
              media.title.native !== title && (
                <p className="mt-3 text-lg text-[var(--muted)]">
                  {media.title.native}
                </p>
              )}

            <div className="mt-8 flex flex-wrap gap-6">
              <div>
                <p className="text-xs uppercase tracking-wider text-[var(--muted)]">
                  Note actuelle
                </p>

                <p className="mt-1 text-2xl font-bold text-white">
                  {media.averageScore
                    ? `${(media.averageScore / 10).toFixed(1)}/10`
                    : "—"}
                </p>
              </div>

              {media.episodes && (
                <div>
                  <p className="text-xs uppercase tracking-wider text-[var(--muted)]">
                    Épisodes
                  </p>

                  <p className="mt-1 text-2xl font-bold text-white">
                    {media.episodes}
                  </p>
                </div>
              )}

              {media.volumes && (
                <div>
                  <p className="text-xs uppercase tracking-wider text-[var(--muted)]">
                    Volumes
                  </p>

                  <p className="mt-1 text-2xl font-bold text-white">
                    {media.volumes}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-10">
              <h2 className="text-lg font-semibold text-white">
                Synopsis
              </h2>

              <p className="mt-3 max-w-3xl leading-8 text-[var(--muted)]">
                {stripHtml(media.description)}
              </p>
            </div>

            {media.genres.length > 0 && (
              <div className="mt-8">
                <h2 className="text-lg font-semibold text-white">
                  Genres
                </h2>

                <div className="mt-3 flex flex-wrap gap-2">
                  {media.genres.map((genre) => (
                    <span
                      key={genre}
                      className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm text-[var(--muted)]"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-10">
              <ReviewForm mediaId={media.id} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}