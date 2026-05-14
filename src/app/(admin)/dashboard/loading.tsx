export default function DashboardLoading() {
  return (
    <main className="mx-auto w-full max-w-6xl animate-pulse px-4 py-8">
      <header className="mb-6 flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900 md:flex-row md:items-center md:justify-between">
        <div className="space-y-3">
          <div className="h-8 w-48 rounded-lg bg-gray-200 dark:bg-gray-700" />
          <div className="h-4 w-64 rounded bg-gray-200 dark:bg-gray-600" />
          <div className="h-4 w-56 rounded bg-gray-200 dark:bg-gray-600" />
        </div>
        <div className="h-10 w-24 rounded-md bg-gray-200 dark:bg-gray-700" />
      </header>

      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        <div className="h-6 w-40 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="mt-4 space-y-2">
          <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-600" />
          <div className="h-4 w-full max-w-xl rounded bg-gray-200 dark:bg-gray-600" />
        </div>
        <div className="mt-6 h-24 w-full rounded-lg bg-gray-200 dark:bg-gray-700" />
      </div>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
          <div className="h-6 w-28 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="mt-4 grid gap-2">
            <div className="h-10 w-full rounded-md bg-gray-200 dark:bg-gray-700" />
            <div className="h-20 w-full rounded-md bg-gray-200 dark:bg-gray-700" />
            <div className="h-10 w-full rounded-md bg-gray-200 dark:bg-gray-700" />
            <div className="h-10 w-full rounded-md bg-gray-200 dark:bg-gray-700" />
            <div className="h-10 w-full rounded-md bg-gray-200 dark:bg-gray-700" />
            <div className="h-10 w-32 rounded-md bg-gray-200 dark:bg-gray-700" />
          </div>
          <ul className="mt-4 space-y-2">
            <li className="h-12 w-full rounded-md bg-gray-200 dark:bg-gray-700" />
            <li className="h-12 w-full rounded-md bg-gray-200 dark:bg-gray-700" />
          </ul>
        </article>
        <article className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
          <div className="h-6 w-24 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="mt-4 grid gap-2">
            <div className="h-10 w-full rounded-md bg-gray-200 dark:bg-gray-700" />
            <div className="h-10 w-full rounded-md bg-gray-200 dark:bg-gray-700" />
            <div className="h-10 w-32 rounded-md bg-gray-200 dark:bg-gray-700" />
          </div>
          <ul className="mt-4 space-y-2">
            <li className="h-12 w-full rounded-md bg-gray-200 dark:bg-gray-700" />
            <li className="h-12 w-full rounded-md bg-gray-200 dark:bg-gray-700" />
          </ul>
        </article>
      </section>
    </main>
  );
}
