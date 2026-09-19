import { NextResponse } from "next/server";
import { googleAuthUrl } from "@/lib/calendar/google";
import { getCurrentOrgId } from "@/lib/org";

export async function GET() {
  const { organizationId } = await getCurrentOrgId();
  if (!organizationId) {
    return NextResponse.redirect(new URL("/login", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"));
  }
  if (!process.env.GOOGLE_CLIENT_ID) {
    return NextResponse.json({ error: "GOOGLE_CLIENT_ID puuttuu." }, { status: 500 });
  }
  return NextResponse.redirect(googleAuthUrl(organizationId));
}
