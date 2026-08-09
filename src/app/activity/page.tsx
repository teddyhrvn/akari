import { ActivityFeed } from "@/components/social/activity-feed";

export default function ActivityPage() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-sm font-medium uppercase tracking-wider text-[var(--accent)]">
          Akari
        </p>

        <h1 className="mt-2 text-4xl font-bold text-white">
          Activité
        </h1>

        <p className="mt-3 text-[var(--muted)]">
          Découvrez ce que regardent et lisent les
          personnes que vous suivez.
        </p>

        <div className="mt-10">
          <ActivityFeed />
        </div>
      </div>
    </main>
  );
}