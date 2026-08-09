import Link from "next/link";

interface MediaCardProps {
  media: {
    id: number;
    title: string;
    title_native: string | null;
    cover_image: string | null;
    type: "ANIME" | "MANGA";
    season_year: number | null;
    average_score: number | null;
  };
}

export function MediaCard({
  media,
}: MediaCardProps) {
  return (
    <Link
      href={`/media/${media.id}`}
      className="group block"
    >
      <article>
        <div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-[var(--surface)]">
          {media.cover_image ? (
            <img
              src={media.cover_image}
              alt={media.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center p-4 text-center text-sm text-[var(--muted)]">
              Aucune couverture
            </div>
          )}

          <div className="absolute left-3 top-3 rounded-lg bg-black/70 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
            {media.type}
          </div>
        </div>

        <div className="mt-3">
          <h3 className="line-clamp-2 font-semibold text-white transition-colors group-hover:text-[var(--accent)]">
            {media.title}
          </h3>

          <div className="mt-1 flex items-center justify-between gap-2 text-sm text-[var(--muted)]">
            <span>
              {media.season_year ?? "—"}
            </span>

            {media.average_score !== null && (
              <span className="text-[var(--accent)]">
                ★{" "}
                {(
                  media.average_score / 10
                ).toFixed(1)}
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}