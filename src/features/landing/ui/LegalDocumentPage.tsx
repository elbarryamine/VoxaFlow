import type { LegalDocument } from "@/src/features/landing/constants/LEGAL_COPY";
import { MarketingShell } from "@/src/features/landing/ui/MarketingShell";

interface LegalDocumentPageProps {
  document: LegalDocument;
}

export const LegalDocumentPage = ({ document }: LegalDocumentPageProps) => (
  <MarketingShell>
    <main className="relative z-10">
      <article className="border-b border-border/50 px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-2xl">
          <p className="font-manrope text-[11px] font-bold uppercase tracking-[0.28em] text-secondary">
            {document.kicker}
          </p>
          <h1 className="mt-4 font-newsreader text-4xl font-bold tracking-tight text-on-surface sm:text-5xl">
            {document.title}
          </h1>
          <p className="mt-4 font-manrope text-[13px] font-semibold uppercase tracking-[0.12em] text-on-surface-variant">
            Last updated {document.updated}
          </p>
          <p className="mt-8 font-manrope text-[16px] font-medium leading-relaxed text-on-surface-variant">
            {document.intro}
          </p>
        </div>
      </article>

      <div className="px-5 py-12 sm:px-8 sm:py-16 lg:px-12">
        <div className="mx-auto max-w-2xl space-y-12">
          {document.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="font-newsreader text-2xl font-bold tracking-tight text-on-surface">
                {section.heading}
              </h2>
              <div className="mt-4 space-y-4">
                {section.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="font-manrope text-[15px] font-medium leading-relaxed text-on-surface-variant"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  </MarketingShell>
);
