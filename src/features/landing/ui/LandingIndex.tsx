import { AUTH_FEATURES } from "@/src/features/auth/constants/AUTH_UI";

export const LandingIndex = () => (
  <section id="index" className="scroll-mt-20 px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
    <div className="mx-auto max-w-[90rem]">
      <div className="flex flex-col gap-6 border-b-2 border-primary pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-manrope text-[11px] font-bold uppercase tracking-[0.28em] text-secondary">
            Index
          </p>
          <h2 className="mt-3 font-newsreader text-4xl font-bold tracking-tight text-on-surface sm:text-5xl">
            Seven things the studio does well
          </h2>
        </div>
        <p className="max-w-sm font-manrope text-[14px] font-medium leading-relaxed text-on-surface-variant lg:text-right">
          No feature dump in tiny cards — just the catalogue, like a field guide.
        </p>
      </div>

      <ol className="mt-0 divide-y-2 divide-primary/10">
        {AUTH_FEATURES.map(({ icon: Icon, step, title, description, tag }) => (
          <li
            key={step}
            className="landing-index-row group grid gap-6 py-10 transition-colors hover:bg-surface-container-low/50 sm:grid-cols-[5rem_1fr_auto] sm:items-start sm:gap-10 sm:py-12 lg:grid-cols-[7rem_1fr_12rem]"
          >
            <span
              className="font-newsreader text-5xl font-bold leading-none text-primary/20 transition-colors group-hover:text-secondary/80 sm:text-6xl lg:text-7xl"
              aria-hidden
            >
              {step}
            </span>

            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center border-2 border-primary/15 text-on-surface">
                  <Icon className="h-4 w-4" weight="bold" aria-hidden />
                </span>
                <h3 className="font-newsreader text-2xl font-bold tracking-tight text-on-surface sm:text-[1.65rem]">
                  {title}
                </h3>
              </div>
              <p className="mt-3 max-w-2xl font-manrope text-[15px] font-medium leading-relaxed text-on-surface-variant">
                {description}
              </p>
            </div>

            <p className="font-manrope text-[11px] font-bold uppercase tracking-[0.22em] text-secondary sm:pt-2 sm:text-right">
              {tag}
            </p>
          </li>
        ))}
      </ol>
    </div>
  </section>
);
