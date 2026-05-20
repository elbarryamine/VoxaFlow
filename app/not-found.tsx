import Link from "next/link";
import { Compass, SquaresFour, GitBranch } from "@phosphor-icons/react/dist/ssr";
import { TopBarLink } from "@/src/shared/ui/TopBarButton";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-6 py-16">
      <section className="w-full max-w-md rounded-2xl border border-border/50 bg-card p-8 text-center shadow-sm sm:p-10">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-secondary-container/60 text-on-secondary-container">
          <Compass className="h-7 w-7" weight="duotone" />
        </div>

        <p className="mt-6 font-manrope text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
          Error 404
        </p>
        <h1 className="mt-2 font-newsreader text-3xl font-bold tracking-tight text-on-surface sm:text-4xl">
          Page not found
        </h1>
        <p className="mt-3 font-manrope text-[14px] font-medium leading-relaxed text-on-surface-variant">
          The page you requested does not exist or may have been moved. Head
          back to the dashboard to keep building.
        </p>

        <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <TopBarLink href="/dashboard" variant="primary" className="justify-center">
            <SquaresFour className="h-4 w-4 shrink-0" weight="bold" />
            Go to dashboard
          </TopBarLink>
          <TopBarLink
            href="/dashboard/workflows"
            variant="secondary"
            className="justify-center"
          >
            <GitBranch className="h-4 w-4 shrink-0" weight="bold" />
            View workflows
          </TopBarLink>
        </div>

        <p className="mt-6 font-manrope text-[12px] font-medium text-on-surface-variant/80">
          Wrong URL?{" "}
          <Link
            href="/auth/sign-in"
            className="font-bold text-secondary underline-offset-2 hover:underline"
          >
            Sign in
          </Link>{" "}
          with a different account.
        </p>
      </section>
    </main>
  );
}
