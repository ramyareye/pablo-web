import type { PagesFunction, Response as CfResponse } from "@cloudflare/workers-types";
import type { Env } from "./_proxy";

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request } = context;

  if (request.method === "OPTIONS") {
    return new Response("", {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Accept",
        "Access-Control-Max-Age": "86400",
      },
    }) as unknown as CfResponse;
  }

  const res = await context.next();
  const headers = new Headers();
  for (const [key, value] of res.headers as unknown as Iterable<[string, string]>) {
    headers.set(key, value);
  }
  headers.set("Access-Control-Allow-Origin", "*");
  return new Response(res.body as unknown as BodyInit | null, {
    status: res.status,
    headers,
  }) as unknown as CfResponse;
};
