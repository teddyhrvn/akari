"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function MediaSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const value = query.trim();

    if (!value) {
      router.push("/search");
      return;
    }

    router.push(`/search?q=${encodeURIComponent(value)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Rechercher un anime ou manga..."
          className="h-14 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-5 pr-28 text-white outline-none transition-colors placeholder:text-[var(--muted)] focus:border-[var(--accent)]"
        />

        <button
          type="submit"
          className="absolute right-2 top-2 h-10 rounded-xl bg-[var(--accent)] px-5 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-hover)]"
        >
          Rechercher
        </button>
      </div>
    </form>
  );
}