import { NextRequest } from "next/server";
import { verifyToken, getAuthToken } from "@/lib/auth";
import { AppError } from "@/lib/api/errors";

export async function requireAuth(
  request: NextRequest,
): Promise<{ username: string }> {
  const token = getAuthToken(request);

  if (!token) {
    throw new AppError(
      "UNAUTHORIZED",
      "Authentication required",
      401,
    );
  }

  const user = await verifyToken(token);

  if (!user) {
    throw new AppError("UNAUTHORIZED", "Invalid or expired token", 401);
  }

  return user;
}
