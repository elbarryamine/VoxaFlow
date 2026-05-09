import { Lightning, Phone, Robot, ChatCircleText } from "@phosphor-icons/react";

export const WORKFLOW_TEMPLATES = [
  {
    id: "lead-gen",
    title: "Lead Generation",
    description: "Qualify inbound leads and book appointments automatically.",
    icon: Lightning,
  },
  {
    id: "support",
    title: "Customer Support",
    description: "Handle common support queries and escalate to human agents.",
    icon: ChatCircleText,
  },
  {
    id: "outbound",
    title: "Outbound Sales",
    description: "Conduct cold outreach calls with personalized AI agents.",
    icon: Phone,
  },
  {
    id: "ai-triage",
    title: "AI Triage",
    description: "Analyze user intent and route calls to the right department.",
    icon: Robot,
  },
];
