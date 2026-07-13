import { NextRequest, NextResponse } from "next/server";
import { AppError, handleError } from "@/lib/api/errors";
import { requireAuth } from "@/lib/api/auth-middleware";
import { getMediaRecord, deleteMediaRecord } from "@/lib/api/media-service";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAuth(request);
    const { id } = await params;

    const entry = await getMediaRecord(id);
    if (!entry) {
      throw new AppError("NOT_FOUND", "Media not found", 404);
    }

    await deleteMediaRecord(id);

    return NextResponse.json({ deleted: true });
  } catch (err) {
    return handleError(err);
  }
}
