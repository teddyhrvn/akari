export function HomeHero() {
  return (
    <section className="border-b border-[var(--border)]">
      <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">
        <div className="max-w-3xl">
          <p className="mb-5 text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
            Anime · Manga · Communauté
          </p>

          <h1 className="text-5xl font-bold tracking-tight text-white md:text-7xl">
            Vos histoires.
            <br />
            Vos notes.
            <br />
            <span className="text-[var(--accent)]">Votre Akari.</span>
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-8 text-[var(--muted)]">
            Découvrez les Anime et Manga que vous aimez, notez vos
            expériences et partagez-les avec une communauté de passionnés.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <button className="rounded-xl bg-[var(--accent)] px-6 py-3 font-medium text-white transition-colors hover:bg-[var(--accent-hover)]">
              Explorer Akari
            </button>

            <button className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-6 py-3 font-medium text-white transition-colors hover:bg-[var(--surface-hover)]">
              Créer un compte
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}