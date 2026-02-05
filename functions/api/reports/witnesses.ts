import type { PagesFunction } from "@cloudflare/workers-types";
import { proxyToPabloApi, type Env } from "./_proxy";

export const onRequest: PagesFunction<Env> = async ({ request, env }) =>
  proxyToPabloApi(request, env, "/api/reports/witnesses");
