import Link from "next/link";
import type { Media } from "@/types/anime";

interface SearchResultsProps {
  results: Media[];
  loading: boolean;
}

function getTitle(media: Media) {
  return (
    media.title.english ||
    media.title.romaji ||
    media.title.native ||
    "Titre inconnu"
  );
}

export function SearchResults({
  results,
  loading,
}: SearchResultsProps) {
  if (loading) {
    return (
      <div className="py-12 text-center text-[var(--muted)]">
        Recherche en cours...
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[var(--border)] px-6 py-12 text-center text-[var(--muted)]">
        Aucun résultat.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {results.map((media) => (
        <Link
          key={media.id}
          href={`/media/${media.id}`}
          className="group overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] transition-transform hover:-translate-y-1"
        >
          <div className="aspect-[2/3] overflow-hidden bg-[var(--surface-hover)]">
            {media.cover.large && (
              <img
                src={media.cover.large}
                alt={getTitle(media)}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            )}
          </div>

          <div className="p-3">
            <h3 className="line-clamp-2 text-sm font-semibold text-white">
              {getTitle(media)}
            </h3>

            <div className="mt-2 flex items-center justify-between text-xs text-[var(--muted)]">
              <span>
                {media.type === "ANIME"
                  ? "Anime"
                  : "Manga"}
              </span>

              {media.averageScore && (
                <span>
                  {(media.averageScore / 10).toFixed(1)}
                  /10
                </span>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}