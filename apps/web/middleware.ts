import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const DEPLOYED_SERVER = "http://35.183.45.140";

export function middleware(req: NextRequest) {
  const host = req.headers.get("host");

  if (process.env.DOMAIN && host && host.endsWith(process.env.DOMAIN)) {
    const url = req.nextUrl.clone();
    console.log(url);

    const targetUrl = `${DEPLOYED_SERVER}${url.pathname}${url.search}`;

    return NextResponse.rewrite(targetUrl);
  }

  return NextResponse.next();
}
