export const LandingBlueprint = () => (
  <aside
    className="landing-blueprint relative hidden border-l-2 border-primary/15 bg-surface-container-low lg:block"
    aria-label="Workflow schematic"
  >
    <div className="landing-blueprint-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden />

    <div className="relative flex h-full min-h-112 flex-col justify-between p-8 xl:p-10">
      <div className="flex items-start justify-between font-manrope text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant">
        <span>Fig. A — Run path</span>
        <span className="text-secondary">live</span>
      </div>

      <svg
        className="mx-auto w-full max-w-[280px] text-primary/70"
        viewBox="0 0 280 320"
        fill="none"
        aria-hidden
      >
        <rect
          x="20"
          y="24"
          width="96"
          height="44"
          rx="2"
          className="landing-draw-stroke"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <text x="32" y="52" fill="currentColor" fontSize="11" fontFamily="system-ui" opacity="0.7">
          trigger
        </text>

        <path
          d="M68 68 V108"
          className="landing-flow-line"
          stroke="currentColor"
          strokeWidth="1.5"
        />

        <polygon
          points="68,108 58,128 78,128"
          fill="var(--secondary)"
          className="landing-draw-fill"
        />

        <path
          d="M68 128 L68 168 L140 168"
          className="landing-flow-line landing-flow-line-delay"
          stroke="currentColor"
          strokeWidth="1.5"
        />

        <rect
          x="140"
          y="148"
          width="110"
          height="44"
          rx="2"
          className="landing-draw-stroke landing-draw-stroke-delay"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <text x="152" y="176" fill="currentColor" fontSize="11" fontFamily="system-ui" opacity="0.7">
          openai.step
        </text>

        <path
          d="M195 192 V232"
          className="landing-flow-line"
          stroke="currentColor"
          strokeWidth="1.5"
        />

        <rect
          x="152"
          y="232"
          width="96"
          height="44"
          rx="2"
          fill="color-mix(in srgb, var(--secondary) 18%, transparent)"
          stroke="var(--secondary)"
          strokeWidth="1.5"
        />
        <text x="164" y="260" fill="var(--secondary)" fontSize="11" fontFamily="system-ui">
          ✓ sent
        </text>

        <circle cx="240" cy="40" r="18" className="landing-draw-stroke" stroke="currentColor" strokeWidth="1" />
        <path d="M240 28 V52 M228 40 H252" stroke="currentColor" strokeWidth="1" />
      </svg>

      <ul className="space-y-2 border-t border-dashed border-primary/20 pt-6 font-manrope text-[11px] leading-relaxed text-on-surface-variant">
        <li className="landing-log-line">
          <span className="text-secondary">00:01</span> webhook.received
        </li>
        <li className="landing-log-line landing-log-line-delay-1">
          <span className="text-secondary">00:02</span> branch.matched → ai
        </li>
        <li className="landing-log-line landing-log-line-delay-2">
          <span className="text-secondary">00:04</span> run.complete
        </li>
      </ul>
    </div>

    <span
      className="pointer-events-none absolute bottom-6 left-6 font-manrope text-[9px] font-bold uppercase tracking-[0.3em] text-primary/25"
      aria-hidden
    >
      Auren / schematic
    </span>
  </aside>
);
