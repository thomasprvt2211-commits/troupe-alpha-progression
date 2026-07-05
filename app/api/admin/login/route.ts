import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  getAdminCookieOptions,
} from "@/src/lib/admin/auth";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { code?: string };
    const code = typeof body.code === "string" ? body.code.trim() : "";
    const expected = process.env.ADMIN_PANEL_CODE?.trim();

    if (!expected) {
      return NextResponse.json(
        { success: false, error: "Configuration admin manquante" },
        { status: 500 }
      );
    }

    if (code !== expected) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set(ADMIN_COOKIE_NAME, "true", getAdminCookieOptions());
    return response;
  } catch {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
