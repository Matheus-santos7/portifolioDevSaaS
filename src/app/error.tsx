"use client";

import { useEffect } from "react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app error]", error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 py-16 text-center">
      <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
        Algo correu mal
      </h1>
      <p className="mt-2 max-w-md text-sm text-gray-600 dark:text-gray-400">
        Tente novamente. Se o problema persistir, volte mais tarde.
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="mt-6 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
      >
        Tentar de novo
      </button>
    </div>
  );
}
