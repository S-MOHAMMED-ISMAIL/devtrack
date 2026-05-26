import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    return Response.json({
      open: 12,
      merged: 30,
      closed: 8,
      avgReviewHours: 6,
      mergeRate: 71,
    });
  } catch {
    return Response.json(
      { error: "Failed to load PR metrics" },
      { status: 500 }
    );
  }
}