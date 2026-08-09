"use client";

import { FormEvent, useState } from "react";
import type { Media } from "@/types/anime";

interface SearchBarProps {
  onResults: (results: Media[]) => void;
  onLoading: (loading: boolean) => void;
}

export function SearchBar({
  onResults,
  onLoading,
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const value = query.trim();

    if (!value) {
      return;
    }

    setError("");
    onLoading(true);

    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(value)}`,
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      onResults(data.results);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue.",
      );

      onResults([]);
    } finally {
      onLoading(false);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Rechercher un Anime ou un Manga..."
          className="min-w-0 flex-1 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-white outline-none transition-colors placeholder:text-[var(--muted)] focus:border-[var(--accent)]"
        />

        <button
          type="submit"
          className="rounded-xl bg-[var(--accent)] px-6 py-3 font-medium text-white transition-colors hover:bg-[var(--accent-hover)]"
        >
          Rechercher
        </button>
      </form>

      {error && (
        <p className="mt-3 text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}