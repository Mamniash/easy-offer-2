export default function DefaultSectionLoading() {
  return (
    <section className="pb-20 pt-8 md:pt-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl">
          <div className="animate-pulse space-y-5">
            <div className="h-4 w-36 rounded bg-gray-200" />
            <div className="h-10 w-full max-w-2xl rounded bg-gray-200" />
            <div className="space-y-2">
              <div className="h-4 w-full max-w-3xl rounded bg-gray-200" />
              <div className="h-4 w-4/5 rounded bg-gray-200" />
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="h-10 w-32 rounded-xl bg-gray-200" />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="animate-pulse rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="h-4 w-24 rounded bg-gray-200" />
              <div className="mt-3 h-6 w-3/4 rounded bg-gray-200" />
              <div className="mt-4 space-y-2">
                <div className="h-3 w-full rounded bg-gray-200" />
                <div className="h-3 w-5/6 rounded bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
