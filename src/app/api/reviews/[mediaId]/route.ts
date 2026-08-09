import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface RouteContext {
  params: Promise<{
    mediaId: string;
  }>;
}

export async function GET(
  request: Request,
  context: RouteContext,
) {
  const { mediaId } = await context.params;

  const id = Number(mediaId);

  if (!Number.isInteger(id)) {
    return NextResponse.json(
      { error: "Œuvre invalide." },
      { status: 400 },
    );
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({
      review: null,
    });
  }

  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("user_id", user.id)
    .eq("media_id", id)
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { error: "Impossible de récupérer votre avis." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    review: data,
  });
}