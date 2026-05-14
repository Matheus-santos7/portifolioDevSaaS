"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[global error]", error);
  }, [error]);

  return (
    <html lang="pt-BR">
      <body className="flex min-h-screen flex-col items-center justify-center bg-white px-4 antialiased dark:bg-gray-950">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Erro na aplicação
        </h1>
        <p className="mt-2 max-w-md text-center text-sm text-gray-600 dark:text-gray-400">
          Não foi possível carregar esta página. Pode atualizar ou voltar mais tarde.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="mt-6 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
        >
          Tentar de novo
        </button>
      </body>
    </html>
  );
}
