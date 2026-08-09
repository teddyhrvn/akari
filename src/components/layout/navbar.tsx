import Link from "next/link";

export function Navbar() {
  return (
    <header className="border-b border-[var(--border)] bg-[var(--background)]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link
          href="/"
          className="text-2xl font-bold tracking-tight text-[var(--foreground)]"
        >
          Akari
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-[var(--muted)] md:flex">
          <Link
            href="/search"
            className="transition-colors hover:text-white"
          >
            Découvrir
          </Link>

          <Link
            href="/activity"
            className="transition-colors hover:text-white"
          >
            Activité
          </Link>

          <Link
            href="/library"
            className="transition-colors hover:text-white"
          >
            Ma bibliothèque
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-lg px-4 py-2 text-sm text-[var(--muted)] transition-colors hover:text-white"
          >
            Connexion
          </Link>

          <Link
            href="/signup"
            className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-hover)]"
          >
            S'inscrire
          </Link>
        </div>
      </div>
    </header>
  );
}