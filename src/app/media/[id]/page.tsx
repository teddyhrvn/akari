import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getAniListMediaById } from "@/lib/api/anilist";

import { MediaStatusSelector } from "@/components/media/media-status-selector";
import { ReviewForm } from "@/components/reviews/review-form";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

// Helper pour extraire une vraie chaîne URL (garantie sans [object Object])
function extractImageUrl(source: any): string {
  if (!source) return "";
  
  // Si c'est déjà une chaîne de caractères
  if (typeof source === "string") return source;
  
  // Si c'est un objet (ex: AniList coverImage avec extraLarge/large/medium)
  if (typeof source === "object") {
    const url = source.extraLarge || source.large || source.medium || source.default || "";
    if (typeof url === "string") return url;
  }
  
  return "";
}

function getCoverImage(media: any): string {
  if (!media) return "";
  
  const possibleSources = [
    media.coverImage,
    media.cover_image,
    media.cover,
    media.image,
    media.poster
  ];

  for (const src of possibleSources) {
    const url = extractImageUrl(src);
    if (url) return url;
  }

  return "";
}

function getBannerImage(media: any): string {
  if (!media) return "";
  
  const possibleSources = [
    media.bannerImage,
    media.banner_image,
    media.banner
  ];

  for (const src of possibleSources) {
    const url = extractImageUrl(src);
    if (url) return url;
  }

  return "";
}

export default async function MediaPage({ params }: PageProps) {
  const { id } = await params;
  const mediaId = Number(id);

  if (!Number.isInteger(mediaId)) {
    notFound();
  }

  const media: any = await getAniListMediaById(mediaId);

  if (!media) {
    notFound();
  }

  // Extraction propre des images
  const coverImg = getCoverImage(media);
  const bannerImg = getBannerImage(media);

  // Titres
  const mainTitle =
    typeof media.title === "string"
      ? media.title
      : media.title?.romaji || media.title?.english || media.title?.native || "Sans titre";

  const nativeTitle =
    typeof media.titleNative === "string"
      ? media.titleNative
      : media.title?.native;

  const supabase = await createClient();
  const { data: reviews } = await supabase
    .from("reviews")
    .select(`id, rating, content, created_at, profiles (username, display_name, avatar_url)`)
    .eq("media_ref", media.id)
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <section className="relative overflow-hidden border-b border-[var(--border)]">
        {bannerImg && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20 blur-sm"
            style={{ backgroundImage: `url(${bannerImg})` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--background)]/50 via-[var(--background)]/90 to-[var(--background)]" />

        <div className="relative mx-auto max-w-7xl px-6 py-16">
          <div className="grid gap-10 md:grid-cols-[260px_1fr]">
            <div>
              <div className="overflow-hidden rounded-2xl bg-[var(--surface)] shadow-2xl">
                {coverImg ? (
                  <img
                    src={coverImg}
                    alt={mainTitle}
                    className="aspect-[2/3] w-full object-cover"
                  />
                ) : (
                  <div className="flex aspect-[2/3] items-center justify-center text-[var(--muted)]">
                    Aucune image
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col justify-end">
              <div className="flex flex-wrap gap-2">
                {media.type && (
                  <span className="rounded-full bg-[var(--accent)]/15 px-3 py-1 text-xs font-semibold text-[var(--accent)]">
                    {media.type}
                  </span>
                )}
                {(media.seasonYear || media.season_year) && (
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white">
                    {media.seasonYear || media.season_year}
                  </span>
                )}
              </div>

              <h1 className="mt-5 text-4xl font-black tracking-tight text-white md:text-6xl">
                {mainTitle}
              </h1>

              {nativeTitle && nativeTitle !== mainTitle && (
                <p className="mt-2 text-lg text-[var(--muted)]">{nativeTitle}</p>
              )}

              {(media.averageScore !== null && media.averageScore !== undefined) ||
              (media.average_score !== null && media.average_score !== undefined) ? (
                <div className="mt-6 flex items-center gap-3">
                  <span className="text-3xl font-bold text-[var(--accent)]">
                    ★ {((media.averageScore ?? media.average_score) / 10).toFixed(1)}
                  </span>
                  <span className="text-sm text-[var(--muted)]">Score AniList</span>
                </div>
              ) : null}

              <div className="mt-6 flex flex-wrap gap-2">
                {media.genres?.map((genre: string) => (
                  <span
                    key={genre}
                    className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm text-[var(--muted)]"
                  >
                    {genre}
                  </span>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-4 text-sm text-[var(--muted)]">
                {media.episodes && <span>{media.episodes} épisodes</span>}
                {media.chapters && <span>{media.chapters} chapitres</span>}
                {media.status && <span>{media.status}</span>}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
          <div>
            <section>
              <h2 className="text-2xl font-bold text-white">Synopsis</h2>
              <div
                className="prose prose-invert mt-5 max-w-none text-[var(--muted)]"
                dangerouslySetInnerHTML={{
                  __html: media.description ?? "Aucun synopsis disponible.",
                }}
              />
            </section>

            <section className="mt-16">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm font-medium uppercase tracking-wider text-[var(--accent)]">
                    Communauté
                  </p>
                  <h2 className="mt-1 text-2xl font-bold text-white">Avis des membres</h2>
                </div>
                <span className="text-sm text-[var(--muted)]">{reviews?.length ?? 0} avis</span>
              </div>

              <div className="mt-8 space-y-4">
                {reviews && reviews.length > 0 ? (
                  reviews.map((review: any) => (
                    <article
                      key={review.id}
                      className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <Link
                          href={`/users/${review.profiles.username}`}
                          className="font-semibold text-white hover:text-[var(--accent)]"
                        >
                          {review.profiles.display_name ?? review.profiles.username}
                        </Link>
                        <span className="font-bold text-[var(--accent)]">
                          {Number(review.rating).toFixed(1)}/5
                        </span>
                      </div>
                      {review.content && (
                        <p className="mt-4 leading-7 text-[var(--muted)]">{review.content}</p>
                      )}
                    </article>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-[var(--border)] p-10 text-center">
                    <p className="text-[var(--muted)]">Aucun avis pour le moment.</p>
                  </div>
                )}
              </div>
            </section>
          </div>

          <aside>
            <div className="sticky top-8">
              <MediaStatusSelector mediaId={media.id} />

              <div className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
                <p className="text-sm font-medium uppercase tracking-wider text-[var(--accent)]">
                  Votre avis
                </p>
                <h2 className="mt-2 text-xl font-bold text-white">Qu'en pensez-vous ?</h2>
                <div className="mt-6">
                  <ReviewForm mediaId={media.id} />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}