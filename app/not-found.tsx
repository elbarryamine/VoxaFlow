import Link from "next/link";
import { SquaresFour } from "@phosphor-icons/react/dist/ssr";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <section className="w-full max-w-lg rounded-2xl border border-border bg-card p-8 text-center shadow-sm sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          Error 404
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-foreground sm:text-4xl">
          Page not found
        </h1>
        <p className="mt-4 text-sm text-muted-foreground sm:text-base">
          The page you requested does not exist or may have been moved. Please
          use one of the links below to continue.
        </p>

        <div className="mt-8 flex justify-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
          >
            <SquaresFour className="h-4 w-4" />
            Go to dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}
