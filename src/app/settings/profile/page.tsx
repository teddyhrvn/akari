"use client";

import { FormEvent, useEffect, useState } from "react";

interface Profile {
  username: string;
  display_name: string;
  avatar_url: string;
  bio: string;
  banner_url: string;
  location: string;
  website_url: string;
  favorite_quote: string;
  profile_color: string;
}

export default function ProfileSettingsPage() {
  const [profile, setProfile] =
    useState<Profile>({
      username: "",
      display_name: "",
      avatar_url: "",
      bio: "",
      banner_url: "",
      location: "",
      website_url: "",
      favorite_quote: "",
      profile_color: "",
    });

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  useEffect(() => {
    async function loadProfile() {
      const response = await fetch(
        "/api/profile",
      );

      if (!response.ok) {
        setLoading(false);
        return;
      }

      const data =
        await response.json();

      setProfile(data.profile);
      setLoading(false);
    }

    loadProfile();
  }, []);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setSaving(true);
    setMessage("");

    try {
      const response = await fetch(
        "/api/profile",
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(profile),
        },
      );

      if (!response.ok) {
        setMessage(
          "Impossible de sauvegarder.",
        );
        return;
      }

      setMessage(
        "Profil sauvegardé !",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[var(--background)] px-6 py-16">
        <p className="text-[var(--muted)]">
          Chargement...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-sm font-medium uppercase tracking-wider text-[var(--accent)]">
          Paramètres
        </p>

        <h1 className="mt-2 text-4xl font-bold text-white">
          Personnaliser mon profil
        </h1>

        <p className="mt-3 text-[var(--muted)]">
          Faites de votre profil Akari votre espace.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-10 space-y-6"
        >
          <Field
            label="Nom affiché"
            value={profile.display_name}
            onChange={(value) =>
              setProfile({
                ...profile,
                display_name: value,
              })
            }
          />

          <Field
            label="Bio"
            value={profile.bio}
            multiline
            onChange={(value) =>
              setProfile({
                ...profile,
                bio: value,
              })
            }
          />

          <Field
            label="URL de l'avatar"
            value={profile.avatar_url}
            onChange={(value) =>
              setProfile({
                ...profile,
                avatar_url: value,
              })
            }
          />

          <Field
            label="URL de la bannière"
            value={profile.banner_url}
            onChange={(value) =>
              setProfile({
                ...profile,
                banner_url: value,
              })
            }
          />

          <Field
            label="Localisation"
            value={profile.location}
            onChange={(value) =>
              setProfile({
                ...profile,
                location: value,
              })
            }
          />

          <Field
            label="Site web"
            value={profile.website_url}
            onChange={(value) =>
              setProfile({
                ...profile,
                website_url: value,
              })
            }
          />

          <Field
            label="Citation favorite"
            value={profile.favorite_quote}
            multiline
            onChange={(value) =>
              setProfile({
                ...profile,
                favorite_quote: value,
              })
            }
          />

          <Field
            label="Couleur du profil"
            value={profile.profile_color}
            placeholder="#..."
            onChange={(value) =>
              setProfile({
                ...profile,
                profile_color: value,
              })
            }
          />

          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-[var(--accent)] px-6 py-3 font-semibold text-white hover:bg-[var(--accent-hover)] disabled:opacity-50"
          >
            {saving
              ? "Sauvegarde..."
              : "Sauvegarder"}
          </button>

          {message && (
            <p className="text-sm text-[var(--muted)]">
              {message}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  multiline = false,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  placeholder?: string;
}) {
  const className =
    "w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-white outline-none placeholder:text-[var(--muted)] focus:border-[var(--accent)]";

  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-white">
        {label}
      </span>

      {multiline ? (
        <textarea
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          placeholder={placeholder}
          rows={4}
          className={className}
        />
      ) : (
        <input
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          placeholder={placeholder}
          className={className}
        />
      )}
    </label>
  );
}