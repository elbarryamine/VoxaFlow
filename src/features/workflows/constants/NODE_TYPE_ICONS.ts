import type { WorkflowNodeType } from "../types/Workflow.types";

const ICON_BASE = "/icons/nodes";

/** Official brand logos (colored SVGs in public/icons/nodes). */
const BRAND_ICONS = {
  shopify: `${ICON_BASE}/shopify.svg`,
  slack: `${ICON_BASE}/slack.svg`,
  openai: `${ICON_BASE}/openai.svg`,
  googleSheets: `${ICON_BASE}/google-sheets.svg`,
  resend: `${ICON_BASE}/resend.svg`,
  lightfunnels: `${ICON_BASE}/lightfunnels.svg`,
  youcan: `${ICON_BASE}/youcan.svg`,
} as const;

/** Recognizable service / purpose icons (colored, obvious meaning). */
const SEMANTIC_ICONS = {
  gmail: `${ICON_BASE}/gmail.svg`,
  postman: `${ICON_BASE}/postman.svg`,
  httpie: `${ICON_BASE}/httpie.svg`,
  curl: `${ICON_BASE}/curl.svg`,
  clock: `${ICON_BASE}/clock.svg`,
} as const;

/** Neutral placeholder — unknown or unbranded steps only. */
const GENERIC_ICON = `${ICON_BASE}/generic.svg`;

export const NODE_TYPE_ICON_SRC: Record<WorkflowNodeType, string> = {
  "webhook-shopify": BRAND_ICONS.shopify,
  "webhook-lightfunnels": BRAND_ICONS.lightfunnels,
  "webhook-youcan": BRAND_ICONS.youcan,
  "webhook-custom": SEMANTIC_ICONS.curl,
  "ai-custom-model": BRAND_ICONS.openai,
  "integration-slack": BRAND_ICONS.slack,
  "integration-spreadsheet": BRAND_ICONS.googleSheets,
  "integration-email": SEMANTIC_ICONS.gmail,
  "integration-webhook": SEMANTIC_ICONS.httpie,
  "api-request": SEMANTIC_ICONS.postman,
  openai: BRAND_ICONS.openai,
  slack: BRAND_ICONS.slack,
  "send-email": BRAND_ICONS.resend,
  delay: SEMANTIC_ICONS.clock,
};

export const getNodeTypeIconSrc = (type: WorkflowNodeType): string =>
  NODE_TYPE_ICON_SRC[type] ?? GENERIC_ICON;
