import Link from "next/link";

type PlaceholderAction = {
  href: string;
  label: string;
};

type PlaceholderPageProps = {
  badge?: string;
  title: string;
  description: string;
  secondaryDescription?: string;
  primaryAction?: PlaceholderAction;
  secondaryAction?: PlaceholderAction;
};

export default function PlaceholderPage({
  badge,
  title,
  description,
  secondaryDescription,
  primaryAction,
  secondaryAction,
}: PlaceholderPageProps) {
  return (
    <section className="pb-20 pt-10 md:pt-14">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-10 shadow-xl">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.18),transparent_50%),radial-gradient(circle_at_80%_10%,rgba(99,102,241,0.18),transparent_40%)]" />
          {badge ? (
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-500">
              {badge}
            </p>
          ) : null}
          <h1 className="mt-4 text-3xl font-bold text-gray-900 md:text-4xl">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-base text-gray-700 md:text-lg">
            {description}
          </p>
          {secondaryDescription ? (
            <p className="mt-2 max-w-2xl text-sm text-gray-500 md:text-base">
              {secondaryDescription}
            </p>
          ) : null}
          {(primaryAction || secondaryAction) && (
            <div className="mt-8 flex flex-wrap gap-3">
              {primaryAction ? (
                <Link
                  href={primaryAction.href}
                  className="inline-flex items-center justify-center rounded-full bg-gray-900 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800"
                >
                  {primaryAction.label}
                </Link>
              ) : null}
              {secondaryAction ? (
                <Link
                  href={secondaryAction.href}
                  className="inline-flex items-center justify-center rounded-full border border-gray-200 px-5 py-2 text-sm font-semibold text-gray-700 transition hover:border-gray-300 hover:text-gray-900"
                >
                  {secondaryAction.label}
                </Link>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
