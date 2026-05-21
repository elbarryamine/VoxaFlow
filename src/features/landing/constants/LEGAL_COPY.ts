export interface LegalSection {
  heading: string;
  paragraphs: readonly string[];
}

export interface LegalDocument {
  kicker: string;
  title: string;
  updated: string;
  intro: string;
  sections: readonly LegalSection[];
}

export const PRIVACY_POLICY: LegalDocument = {
  kicker: "Legal",
  title: "Privacy Policy",
  updated: "May 21, 2026",
  intro:
    "This policy describes how Auren collects, uses, and protects information when you use the workflow studio, execution logs, and connected integrations.",
  sections: [
    {
      heading: "Information we collect",
      paragraphs: [
        "Account information you provide at sign-up, such as your email address and authentication identifiers from your sign-in provider.",
        "Workflow definitions you create in the studio, including node configuration, connections, and template customizations.",
        "Execution data generated when workflows run, including timestamps, node outcomes, and error messages needed to debug automations.",
        "Credentials and API keys you store in the vault to connect third-party services. These are encrypted at rest and used only to execute workflows you authorize.",
        "Technical data such as browser type, IP address, and usage events required to operate and secure the service.",
      ],
    },
    {
      heading: "How we use information",
      paragraphs: [
        "We use your data to operate the studio, run workflows on your behalf, display run history, and improve reliability of the platform.",
        "We do not sell your personal information. We do not use workflow content to train public AI models.",
        "We may use aggregated, de-identified statistics to understand product usage and plan capacity.",
      ],
    },
    {
      heading: "Third-party services",
      paragraphs: [
        "When you connect integrations (for example Shopify, OpenAI, Slack, or email providers), data flows between Auren and those services according to your workflow design and their respective policies.",
        "You are responsible for ensuring you have the right to send customer or order data through automations you build.",
        "Our infrastructure providers process data under contractual obligations to protect it and use it only to deliver the service.",
      ],
    },
    {
      heading: "Retention and deletion",
      paragraphs: [
        "Workflow definitions and credentials remain until you delete them or close your account.",
        "Run history is retained according to your plan limits. Older runs may be removed automatically when limits apply.",
        "You may request deletion of your account and associated data by contacting us through the channels made available in the product.",
      ],
    },
    {
      heading: "Security",
      paragraphs: [
        "We apply access controls, encryption in transit, and industry-standard practices to protect stored credentials and execution data.",
        "No method of transmission over the internet is fully secure. We encourage strong passwords and limited sharing of API keys.",
      ],
    },
    {
      heading: "Your rights",
      paragraphs: [
        "Depending on where you live, you may have rights to access, correct, export, or delete personal data we hold about you.",
        "We will respond to verified requests within a reasonable timeframe and as required by applicable law.",
      ],
    },
    {
      heading: "Changes to this policy",
      paragraphs: [
        "We may update this policy as the product evolves. We will post the revised date at the top of this page. Material changes will be communicated to workspace owners through the product or email where appropriate.",
      ],
    },
  ],
};

export const TERMS_OF_SERVICE: LegalDocument = {
  kicker: "Legal",
  title: "Terms of Service",
  updated: "May 21, 2026",
  intro:
    "These terms govern your access to and use of Auren. By creating an account or using the studio, you agree to them.",
  sections: [
    {
      heading: "The service",
      paragraphs: [
        "Auren provides a visual workflow studio, execution engine, credential storage, and related tools to design and run automations.",
        "Features and limits may vary by plan. We may add, change, or discontinue features with reasonable notice when practicable.",
      ],
    },
    {
      heading: "Your account",
      paragraphs: [
        "You must provide accurate registration information and keep your credentials secure.",
        "You are responsible for activity under your account, including workflows created and integrations connected.",
        "You must be at least 18 years old, or the age of majority in your jurisdiction, to use the service.",
      ],
    },
    {
      heading: "Acceptable use",
      paragraphs: [
        "You may not use Auren to violate law, infringe others' rights, send unsolicited spam, distribute malware, or attempt to disrupt the platform.",
        "You may not probe or bypass security measures, scrape the service without permission, or resell access without written agreement.",
        "Automations you build must comply with the terms of connected third-party platforms and applicable data-protection rules.",
      ],
    },
    {
      heading: "Workflows and integrations",
      paragraphs: [
        "You retain ownership of workflows and data you submit. You grant us a limited license to host, process, and transmit that data solely to operate the service.",
        "We are not responsible for third-party APIs, rate limits, or outages outside our control. Execution failures caused by external services are not guaranteed to be recoverable.",
      ],
    },
    {
      heading: "Plans and billing",
      paragraphs: [
        "Paid plans, run limits, and seat counts are described on the pricing page. Fees are billed in advance unless stated otherwise.",
        "You may cancel or change plans according to flows shown in the product. Downgrades take effect at the end of the current billing period where applicable.",
        "We may suspend or limit usage that substantially exceeds fair-use expectations for your plan.",
      ],
    },
    {
      heading: "Availability and disclaimers",
      paragraphs: [
        "We strive for reliable uptime but do not guarantee uninterrupted service. The platform is provided \"as is\" to the extent permitted by law.",
        "We disclaim implied warranties of merchantability, fitness for a particular purpose, and non-infringement where allowed.",
      ],
    },
    {
      heading: "Limitation of liability",
      paragraphs: [
        "To the maximum extent permitted by law, Auren and its operators are not liable for indirect, incidental, special, consequential, or punitive damages, or lost profits arising from your use of the service.",
        "Our total liability for any claim relating to the service is limited to the amount you paid us in the twelve months before the claim, or one hundred US dollars if you use a free plan.",
      ],
    },
    {
      heading: "Termination",
      paragraphs: [
        "You may stop using the service at any time. We may suspend or terminate access if you breach these terms or if required for security or legal reasons.",
        "Upon termination, your right to use the studio ends. Provisions that by nature should survive will remain in effect.",
      ],
    },
    {
      heading: "Governing terms",
      paragraphs: [
        "These terms constitute the entire agreement between you and Auren regarding the service, superseding prior understandings on the same subject.",
        "If a provision is found unenforceable, the remaining provisions remain in effect. Our failure to enforce a right is not a waiver of that right.",
        "We may update these terms by posting a new version on this page. Continued use after changes become effective constitutes acceptance.",
      ],
    },
  ],
};
