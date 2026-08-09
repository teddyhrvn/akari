import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
) {
  const supabase = await createClient();

  const search =
    request.nextUrl.searchParams.get(
      "search",
    );

  const type =
    request.nextUrl.searchParams.get("type");

  const limit = Math.min(
    Number(
      request.nextUrl.searchParams.get(
        "limit",
      ) ?? 20,
    ),
    50,
  );

  let query = supabase
    .from("media")
    .select("*")
    .order("updated_at", {
      ascending: false,
    })
    .limit(limit);

  if (search) {
    query = query.ilike(
      "title",
      `%${search}%`,
    );
  }

  if (
    type === "ANIME" ||
    type === "MANGA"
  ) {
    query = query.eq("type", type);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json(
      {
        error:
          "Impossible de récupérer le catalogue.",
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    media: data ?? [],
  });
}