import { headers } from "next/headers";

export async function getPathname(): Promise<string> {
  const headersList = await headers();
  const header_url = headersList.get("x-url") || "";

  try {
    const url = new URL(header_url);
    return url.pathname;
  } catch {
    return "/";
  }
}
