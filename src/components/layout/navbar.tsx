export function Navbar() {
  return (
    <header className="border-b border-[var(--border)] bg-[var(--background)]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <a
          href="/"
          className="text-2xl font-bold tracking-tight text-[var(--foreground)]"
        >
          Akari
        </a>

        <nav className="hidden items-center gap-8 text-sm text-[var(--muted)] md:flex">
          <a
            href="#discover"
            className="transition-colors hover:text-white"
          >
            Découvrir
          </a>

          <a
            href="#activity"
            className="transition-colors hover:text-white"
          >
            Activité
          </a>

          <a
            href="#lists"
            className="transition-colors hover:text-white"
          >
            Listes
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <button className="rounded-lg px-4 py-2 text-sm text-[var(--muted)] transition-colors hover:text-white">
            Connexion
          </button>

          <button className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-hover)]">
            S'inscrire
          </button>
        </div>
      </div>
    </header>
  );
}