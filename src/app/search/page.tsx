"use client";

import { useState } from "react";
import { SearchBar } from "@/components/search/search-bar";
import { SearchResults } from "@/components/search/search-results";
import type { Media } from "@/types/anime";

export default function SearchPage() {
  const [results, setResults] = useState<Media[]>([]);
  const [loading, setLoading] = useState(false);

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-10 max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-widest text-[var(--accent)]">
            Recherche
          </p>

          <h1 className="mt-2 text-4xl font-bold text-white">
            Trouvez votre prochaine histoire.
          </h1>

          <p className="mt-4 text-[var(--muted)]">
            Recherchez parmi les Anime et Manga disponibles sur Akari.
          </p>
        </div>

        <SearchBar
          onResults={setResults}
          onLoading={setLoading}
        />

        <section className="mt-10">
          <SearchResults
            results={results}
            loading={loading}
          />
        </section>
      </div>
    </main>
  );
}