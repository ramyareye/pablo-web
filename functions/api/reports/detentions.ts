import type { PagesFunction, Request as CfRequest } from "@cloudflare/workers-types";
import { proxyToPabloApi, type Env } from "./_proxy";

export const onRequest: PagesFunction<Env> = async ({ request, env }) =>
  proxyToPabloApi(request as unknown as CfRequest, env, "/api/reports/detentions");
