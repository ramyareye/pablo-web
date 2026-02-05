export type Env = {
  // Base URL of the pablo API Worker, e.g. "https://pablo.<account>.workers.dev"
  PABLO_API_URL: string;
};

export async function proxyToPabloApi(
  request: Request,
  env: Env,
  pathname: string,
) {
  const base = env.PABLO_API_URL?.trim();
  if (!base) {
    return new Response("PABLO_API_URL is not configured", { status: 500 });
  }

  const incomingUrl = new URL(request.url);
  const upstreamUrl = new URL(pathname + incomingUrl.search, base);

  const headers = new Headers(request.headers);
  headers.delete("host");

  // Stream through (supports multipart uploads without buffering).
  return fetch(upstreamUrl.toString(), {
    method: request.method,
    headers,
    body: request.body,
  });
}
