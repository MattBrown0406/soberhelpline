const FREEDOM_BASE_URL = "https://freedominterventions.com";

type FreedomBridgeOptions = {
  campaign?: string;
  content?: string;
  source?: string;
};

const buildFreedomUrl = (path: string, options: FreedomBridgeOptions = {}) => {
  const url = new URL(path, FREEDOM_BASE_URL);
  url.searchParams.set("source", "sober_helpline");
  url.searchParams.set("utm_source", "sober_helpline");
  url.searchParams.set("utm_medium", "bridge");
  url.searchParams.set("utm_campaign", options.campaign || "sober_helpline_intervention");
  if (options.content) url.searchParams.set("utm_content", options.content);
  if (options.source) url.searchParams.set("sh_source", options.source);
  return url.toString();
};

export const freedomBridgeUrl = (options: FreedomBridgeOptions = {}) => {
  return buildFreedomUrl("/from-sober-helpline", options);
};

export const freedomReadinessUrl = (options: FreedomBridgeOptions = {}) => {
  return buildFreedomUrl("/intervention-readiness", {
    campaign: "intervention_readiness",
    ...options,
  });
};
