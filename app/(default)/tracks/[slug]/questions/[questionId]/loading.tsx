export default function QuestionLoading() {
  return (
    <section className="pb-20 pt-20 md:pt-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="animate-pulse rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
          <div className="flex items-center justify-between gap-4">
            <div className="h-5 w-40 rounded bg-gray-200" />
            <div className="h-7 w-28 rounded-full bg-gray-200" />
          </div>

          <div className="mt-3 h-3 w-32 rounded bg-gray-200" />

          <div className="mt-4 space-y-3">
            <div className="h-8 w-full rounded bg-gray-200" />
            <div className="h-6 w-4/5 rounded bg-gray-200" />
          </div>

          <div className="mt-6 rounded-xl bg-gray-50 p-6 ring-1 ring-gray-200">
            <div className="h-5 w-36 rounded bg-gray-200" />
            <div className="mt-4 space-y-2">
              <div className="h-4 w-full rounded bg-gray-200" />
              <div className="h-4 w-11/12 rounded bg-gray-200" />
              <div className="h-4 w-4/5 rounded bg-gray-200" />
            </div>
            <div className="mt-5 space-y-2">
              <div className="h-4 w-28 rounded bg-gray-200" />
              <div className="h-4 w-1/2 rounded bg-gray-200" />
            </div>
          </div>
        </div>

        <div className="mt-6 animate-pulse rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-4">
          <div className="h-4 w-32 rounded bg-gray-200" />
          <div className="mt-2 h-4 w-5/6 rounded bg-gray-200" />
        </div>
      </div>
    </section>
  );
}
