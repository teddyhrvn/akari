import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

import { ProfileHeader } from "@/components/profile/profile-header";

interface PageProps {
  params: Promise<{
    username: string;
  }>;
}

export default async function UserPage({
  params,
}: PageProps) {
  const { username } = await params;

  const supabase = await createClient();

  const { data: profile } =
    await supabase
      .from("profiles")
      .select(`
        id,
        username,
        display_name,
        avatar_url,
        bio,
        banner_url,
        location,
        website_url,
        favorite_quote,
        profile_color,
        is_private
      `)
      .eq("username", username)
      .maybeSingle();

  if (!profile) {
    notFound();
  }

  const [
    reviewsResult,
    libraryResult,
    followersResult,
    followingResult,
  ] = await Promise.all([
    supabase
      .from("reviews")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq("user_id", profile.id),

    supabase
      .from("media_entries")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq("user_id", profile.id),

    supabase
      .from("follows")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq("following_id", profile.id),

    supabase
      .from("follows")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq("follower_id", profile.id),
  ]);

  const stats = {
    reviews: reviewsResult.count ?? 0,
    library: libraryResult.count ?? 0,
    followers:
      followersResult.count ?? 0,
    following:
      followingResult.count ?? 0,
  };

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <ProfileHeader
          profile={profile}
          stats={stats}
        />

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
          <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8">
            <p className="text-sm font-medium uppercase tracking-wider text-[var(--accent)]">
              Activité
            </p>

            <h2 className="mt-2 text-2xl font-bold text-white">
              Dernières activités
            </h2>

            <div className="mt-8 rounded-2xl border border-dashed border-[var(--border)] p-10 text-center">
              <p className="text-[var(--muted)]">
                Les activités de cet utilisateur
                apparaîtront ici.
              </p>
            </div>
          </section>

          <aside className="space-y-8">
            <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8">
              <p className="text-sm font-medium uppercase tracking-wider text-[var(--accent)]">
                Collection
              </p>

              <h2 className="mt-2 text-2xl font-bold text-white">
                Bibliothèque
              </h2>

              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                Retrouvez les œuvres suivies par
                @{profile.username}.
              </p>
            </section>

            <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8">
              <p className="text-sm font-medium uppercase tracking-wider text-[var(--accent)]">
                À propos
              </p>

              <h2 className="mt-2 text-xl font-bold text-white">
                Membre Akari
              </h2>

              <p className="mt-3 text-sm text-[var(--muted)]">
                Un profil personnel pour partager
                ses goûts anime et manga.
              </p>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}