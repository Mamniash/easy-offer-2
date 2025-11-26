export default function TrackLoading() {
  return (
    <section className="pb-20 pt-32 md:pt-40">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl">
          <div className="animate-pulse flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="space-y-3">
              <div className="h-5 w-44 rounded bg-gray-200" />
              <div className="h-10 w-80 rounded bg-gray-200" />
              <div className="h-5 w-64 rounded bg-gray-200" />
              <div className="space-y-2">
                <div className="h-4 w-full max-w-xl rounded bg-gray-200" />
                <div className="h-4 w-2/3 rounded bg-gray-200" />
              </div>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="h-8 w-28 rounded-full bg-gray-200" />
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 rounded-xl bg-gray-900 p-6 text-gray-100 shadow-lg">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="space-y-2">
                  <div className="h-4 w-20 rounded bg-gray-700" />
                  <div className="h-6 w-16 rounded bg-gray-600" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="animate-pulse flex flex-col gap-3 border-b border-gray-200 px-6 py-5 md:flex-row md:items-center md:justify-between">
            <div className="h-5 w-32 rounded bg-gray-200" />
            <div className="h-9 w-64 rounded-full bg-gray-200" />
          </div>

          <div className="divide-y divide-gray-200">
            {Array.from({ length: 6 }).map((_, index) => (
              <QuestionSkeleton key={index} />
            ))}
          </div>

          <div className="animate-pulse flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
            <div className="h-4 w-28 rounded bg-gray-200" />
            <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white p-1 text-sm shadow-sm">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="h-8 w-8 rounded-full bg-gray-200" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function QuestionSkeleton() {
  return (
    <div className="px-6 py-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="h-7 w-20 rounded-full bg-gray-200" />
          <div className="space-y-2">
            <div className="h-3 w-24 rounded bg-gray-200" />
            <div className="h-4 w-64 max-w-full rounded bg-gray-200" />
          </div>
        </div>
        <div className="w-full max-w-md space-y-2">
          <div className="h-2 w-full rounded-full bg-gray-200" />
          <div className="ml-auto h-3 w-24 rounded bg-gray-200" />
        </div>
      </div>
    </div>
  );
}
