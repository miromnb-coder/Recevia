import { NextResponse } from "next/server";
import { exchangeCode, appUrl } from "@/lib/calendar/google";
import { getCurrentOrgId } from "@/lib/org";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const app = appUrl();

  if (!code || !state) {
    return NextResponse.redirect(`${app}/dashboard/calendar?error=missing`);
  }

  const { organizationId } = await getCurrentOrgId();
  if (!organizationId || organizationId !== state) {
    return NextResponse.redirect(`${app}/dashboard/calendar?error=session`);
  }

  try {
    const tokens = await exchangeCode(code);
    if (!tokens.refresh_token) {
      return NextResponse.redirect(`${app}/dashboard/calendar?error=no_refresh`);
    }
    const admin = createServiceClient();
    await admin.from("calendar_connections").upsert({
      organization_id: organizationId,
      google_refresh_token: tokens.refresh_token,
      calendar_id: "primary",
      timezone: "Europe/Helsinki",
    });
    return NextResponse.redirect(`${app}/dashboard/calendar?ok=1`);
  } catch {
    return NextResponse.redirect(`${app}/dashboard/calendar?error=token`);
  }
}
