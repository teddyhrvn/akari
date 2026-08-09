const categories = [
  {
    title: "Anime",
    description: "Découvrez les séries et films qui font parler.",
  },
  {
    title: "Manga",
    description: "Gardez une trace de vos lectures et découvertes.",
  },
  {
    title: "Communauté",
    description: "Découvrez ce que les autres passionnés regardent.",
  },
];

export function DiscoverSection() {
  return (
    <section id="discover" className="mx-auto max-w-7xl px-6 py-20">
      <div className="mb-10">
        <p className="text-sm font-medium uppercase tracking-widest text-[var(--accent)]">
          Découvrir
        </p>

        <h2 className="mt-2 text-3xl font-bold text-white">
          Tout votre univers au même endroit.
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {categories.map((category) => (
          <article
            key={category.title}
            className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 transition-colors hover:bg-[var(--surface-hover)]"
          >
            <h3 className="text-xl font-semibold text-white">
              {category.title}
            </h3>

            <p className="mt-3 leading-7 text-[var(--muted)]">
              {category.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}