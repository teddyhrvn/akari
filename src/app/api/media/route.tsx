import { NextRequest, NextResponse } from "next/server";
import { searchAniListMedia } from "@/lib/api/anilist";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const search = (params.get("search") ?? params.get("q"))?.trim() ?? "";
  const typeParam = params.get("type");
  const type = typeParam === "ANIME" || typeParam === "MANGA" ? typeParam : undefined;

  const requestedLimit = Number(params.get("limit") ?? 24);
  const limit = Number.isInteger(requestedLimit) && requestedLimit > 0 ? Math.min(requestedLimit, 50) : 24;

  try {
    const mediaList = await searchAniListMedia(search || undefined, type, limit);

    // Transformation pour être compatible avec ton ancien format attendu par MediaCard
    const formattedMedia = mediaList.map(item => ({
      ...item,
      title: item.title.romaji || item.title.english || item.title.native || "Sans titre",
      title_native: item.title.native,
      cover_image: item.cover.large || item.cover.medium,
      average_score: item.averageScore
    }));

    return NextResponse.json({
      media: formattedMedia,
      count: formattedMedia.length,
    });
  } catch (error) {
    console.error("Media search error:", error);
    return NextResponse.json(
      { error: "Impossible de rechercher dans le catalogue." },
      { status: 500 }
    );
  }
}