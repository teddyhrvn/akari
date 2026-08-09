import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

interface Media {
  id: number;
  anilist_id: number;
  title: string | { english?: string; romaji?: string; native?: string };
  title_native?: string;
  description?: string;
  cover_image?: string;
  banner_image?: string;
  genres?: string[];
}

function getTitle(media: Media): string {
  if (!media) return "Titre inconnu";
  if (typeof media.title === "string") return media.title;
  if (typeof media.title === "object" && media.title !== null) {
    return media.title.english || media.title.romaji || media.title.native || "Titre inconnu";
  }
  return media.title_native || "Titre inconnu";
}

export default async function MediaPage({ params }: RouteParams) {
  const { id } = await params;
  const mediaId = Number(id);

  if (!Number.isInteger(mediaId)) {
    notFound();
  }

  const supabase = await createClient();

  const { data: media, error } = await supabase
    .from("media")
    .select("*")
    .eq("anilist_id", mediaId)
    .maybeSingle();

  if (error || !media) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {media.banner_image && (
          <div className="w-full h-64 overflow-hidden rounded-xl">
            <img
              src={media.banner_image}
              alt="Bannière"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-8 items-start">
          {media.cover_image && (
            <img
              src={media.cover_image}
              alt="Couverture"
              className="w-48 h-72 object-cover rounded-lg shadow-lg"
            />
          )}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">{getTitle(media)}</h1>
            
            {media.genres && media.genres.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {media.genres.map((genre) => (
                  <span
                    key={genre}
                    className="px-3 py-1 bg-secondary text-secondary-foreground text-xs rounded-full"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}

            {media.description && (
              <p
                className="text-muted-foreground text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: media.description }}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}