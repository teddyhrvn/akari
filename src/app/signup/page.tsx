"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");

    if (username.trim().length < 3) {
      setError(
        "Le nom d'utilisateur doit contenir au moins 3 caractères.",
      );

      return;
    }

    if (password.length < 8) {
      setError(
        "Le mot de passe doit contenir au moins 8 caractères.",
      );

      return;
    }

    setLoading(true);

    const supabase = createClient();

    // On passe le username dans les métadonnées (options.data) 
    // pour qu'il soit récupéré automatiquement par le trigger Supabase.
    const {
      data: { user },
      error: signupError,
    } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username.trim(),
        },
      },
    });

    if (signupError || !user) {
      setError(
        signupError?.message ??
          "Impossible de créer le compte.",
      );

      setLoading(false);
      return;
    }

    router.push("/account");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--background)] px-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <a
            href="/"
            className="text-3xl font-bold text-white"
          >
            Akari
          </a>

          <h1 className="mt-8 text-3xl font-bold text-white">
            Créer votre compte
          </h1>

          <p className="mt-3 text-[var(--muted)]">
            Rejoignez Akari et commencez à noter vos
            œuvres préférées.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6"
        >
          <div>
            <label
              htmlFor="username"
              className="mb-2 block text-sm font-medium text-white"
            >
              Nom d'utilisateur
            </label>

            <input
              id="username"
              type="text"
              value={username}
              onChange={(event) =>
                setUsername(event.target.value)
              }
              required
              minLength={3}
              maxLength={30}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-white outline-none focus:border-[var(--accent)]"
              placeholder="akari_user"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-white"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              required
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-white outline-none focus:border-[var(--accent)]"
              placeholder="vous@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-white"
            >
              Mot de passe
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              required
              minLength={8}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-white outline-none focus:border-[var(--accent)]"
              placeholder="8 caractères minimum"
            />
          </div>

          {error && (
            <p className="text-sm text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[var(--accent)] px-6 py-3 font-medium text-white transition-colors hover:bg-[var(--accent-hover)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Création..."
              : "Créer mon compte"}
          </button>

          <p className="text-center text-sm text-[var(--muted)]">
            Déjà membre ?{" "}
            <a
              href="/login"
              className="text-[var(--accent)] hover:underline"
            >
              Se connecter
            </a>
          </p>
        </form>
      </div>
    </main>
  );
}