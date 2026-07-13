import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/lib/api/errors";
import { getMediaData } from "@/lib/api/media-service";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const entry = await getMediaData(id);
    if (!entry || !entry.data) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "File not found" } },
        { status: 404 },
      );
    }

    return new NextResponse(entry.data, {
      headers: {
        "Content-Type": entry.mimeType || "application/octet-stream",
        "Content-Disposition": `inline; filename="${entry.filename}"`,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (err) {
    return handleError(err);
  }
}
