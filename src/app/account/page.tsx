import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AccountPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <p className="text-sm uppercase tracking-widest text-[var(--accent)]">
          Mon compte
        </p>

        <h1 className="mt-3 text-4xl font-bold text-white">
          Bonjour{" "}
          {profile?.display_name ||
            profile?.username ||
            "Akari User"}
          .
        </h1>

        <div className="mt-10 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <p className="text-sm text-[var(--muted)]">
            Email
          </p>

          <p className="mt-1 text-white">
            {user.email}
          </p>

          <p className="mt-6 text-sm text-[var(--muted)]">
            Nom d'utilisateur
          </p>

          <p className="mt-1 text-white">
            @{profile?.username}
          </p>
        </div>
      </div>
    </main>
  );
}