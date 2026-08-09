"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { MediaCard } from "@/components/media/media-card";
import { MediaSearch } from "@/components/media/media-search";

interface Media {
  id: number;
  anilist_id: number;
  type: "ANIME" | "MANGA";
  title: string;
  title_native: string | null;
  cover_image: string | null;
  banner_image: string | null;
  genres: string[];
  status: string | null;
  episodes: number | null;
  chapters: number | null;
  season: string | null;
  season_year: number | null;
  average_score: number | null;
}

export default function SearchPage() {
  const searchParams = useSearchParams();

  // On récupère bien "q" depuis l'URL de recherche
  const query = searchParams.get("q") ?? "";

  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function searchMedia() {
      setLoading(true);

      try {
        const params = new URLSearchParams();

        // On envoie le paramètre "search" attendu par ton API backend
        if (query) {
          params.set("search", query);
        }

        params.set("limit", "24");

        const response = await fetch(
          `/api/media?${params.toString()}`,
        );

        if (!response.ok) {
          return;
        }

        const data = await response.json();

        setMedia(data.media ?? []);
      } finally {
        setLoading(false);
      }
    }

    searchMedia();
  }, [query]);

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-wider text-[var(--accent)]">
            Explorer Akari
          </p>

          <h1 className="mt-2 text-4xl font-bold text-white">
            Recherche
          </h1>

          <p className="mt-3 text-[var(--muted)]">
            Trouvez votre prochain anime ou manga.
          </p>

          <div className="mt-8">
            <MediaSearch />
          </div>
        </div>

        <div className="mt-12">
          {query && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white">
                Résultats pour « {query} »
              </h2>
            </div>
          )}

          {loading ? (
            <p className="text-[var(--muted)]">
              Recherche en cours...
            </p>
          ) : media.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[var(--border)] p-12 text-center">
              <h2 className="text-xl font-semibold text-white">
                Aucun résultat
              </h2>

              <p className="mt-2 text-[var(--muted)]">
                Essayez un autre titre.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {media.map((item) => (
                <MediaCard
                  key={item.id}
                  media={item}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}