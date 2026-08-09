import Link from "next/link";
import { notFound } from "next/navigation";

interface UserPageProps {
  params: Promise<{
    username: string;
  }>;
}

interface UserReview {
  id: string;
  media_id: number;
  rating: number;
  content: string | null;
  created_at: string;
}

interface UserResponse {
  profile: {
    id: string;
    username: string;
    display_name: string | null;
    avatar_url: string | null;
    bio: string | null;
    created_at: string;
  };

  reviews: UserReview[];

  stats: {
    followers: number;
    following: number;
    reviews: number;
  };
}

async function getUser(
  username: string,
): Promise<UserResponse | null> {
  const response = await fetch(
    `${
      process.env.NEXT_PUBLIC_APP_URL ??
      "http://localhost:3000"
    }/api/users/${encodeURIComponent(username)}`,
    {
      next: {
        revalidate: 60,
      },
    },
  );

  if (!response.ok) {
    return null;
  }

  return response.json();
}

export default async function UserPage({
  params,
}: UserPageProps) {
  const { username } = await params;

  const data = await getUser(username);

  if (!data) {
    notFound();
  }

  const { profile, reviews, stats } = data;

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <Link
          href="/"
          className="text-sm text-[var(--muted)] hover:text-white"
        >
          ← Accueil
        </Link>

        <section className="mt-10 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--surface-hover)] text-3xl font-bold text-white">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                profile.username
                  .charAt(0)
                  .toUpperCase()
              )}
            </div>

            <div>
              <p className="text-3xl font-bold text-white">
                {profile.display_name ||
                  profile.username}
              </p>

              <p className="mt-1 text-[var(--muted)]">
                @{profile.username}
              </p>

              {profile.bio && (
                <p className="mt-4 max-w-2xl leading-7 text-[var(--muted)]">
                  {profile.bio}
                </p>
              )}
            </div>
          </div>

          <div className="mt-8 grid grid-cols-3 border-t border-[var(--border)] pt-6">
            <div>
              <p className="text-2xl font-bold text-white">
                {stats.reviews}
              </p>

              <p className="text-sm text-[var(--muted)]">
                Avis
              </p>
            </div>

            <div>
              <p className="text-2xl font-bold text-white">
                {stats.followers}
              </p>

              <p className="text-sm text-[var(--muted)]">
                Abonnés
              </p>
            </div>

            <div>
              <p className="text-2xl font-bold text-white">
                {stats.following}
              </p>

              <p className="text-sm text-[var(--muted)]">
                Abonnements
              </p>
            </div>
          </div>
        </section>

        <section className="mt-12">
          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-[var(--accent)]">
              Activité
            </p>

            <h2 className="mt-2 text-3xl font-bold text-white">
              Derniers avis
            </h2>
          </div>

          {reviews.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-dashed border-[var(--border)] p-10 text-center">
              <p className="text-[var(--muted)]">
                Cet utilisateur n'a encore publié aucun
                avis.
              </p>
            </div>
          ) : (
            <div className="mt-8 space-y-4">
              {reviews.map((review) => (
                <article
                  key={review.id}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-white">
                        Une œuvre a été notée
                      </p>

                      <p className="mt-1 text-sm text-[var(--muted)]">
                        {new Intl.DateTimeFormat(
                          "fr-FR",
                          {
                            dateStyle: "medium",
                          },
                        ).format(
                          new Date(review.created_at),
                        )}
                      </p>
                    </div>

                    <span className="font-semibold text-[var(--accent)]">
                      {Number(review.rating).toFixed(1)}
                      /5
                    </span>
                  </div>

                  {review.content && (
                    <p className="mt-4 leading-7 text-[var(--muted)]">
                      {review.content}
                    </p>
                  )}

                  <Link
                    href={`/media/${review.media_id}`}
                    className="mt-5 inline-block text-sm font-medium text-[var(--accent)] hover:underline"
                  >
                    Voir l'œuvre →
                  </Link>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}