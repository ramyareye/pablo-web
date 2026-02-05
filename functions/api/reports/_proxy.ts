import type { Request as CfRequest, Response as CfResponse } from "@cloudflare/workers-types";

export type Env = {
  // Base URL of the pablo API Worker, e.g. "https://pablo.<account>.workers.dev"
  PABLO_API_URL: string;
};

export async function proxyToPabloApi(
  request: CfRequest,
  env: Env,
  pathname: string,
): Promise<CfResponse> {
  const base = env.PABLO_API_URL?.trim();
  if (!base) {
    return new Response("PABLO_API_URL is not configured", {
      status: 500,
    }) as unknown as CfResponse;
  }

  const incomingUrl = new URL(request.url);
  const upstreamUrl = new URL(pathname + incomingUrl.search, base);

  const headers = new Headers();
  for (const [key, value] of request.headers as unknown as Iterable<[string, string]>) {
    if (key.toLowerCase() === "host") continue;
    headers.set(key, value);
  }

  // Stream through (supports multipart uploads without buffering).
  const proxyRequest = new Request(upstreamUrl.toString(), {
    method: request.method,
    headers,
    body: request.body as unknown as BodyInit | null,
  });

  return fetch(proxyRequest) as unknown as Promise<CfResponse>;
}
