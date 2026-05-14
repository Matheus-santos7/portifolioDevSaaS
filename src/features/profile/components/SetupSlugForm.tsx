"use client";

import { savePortfolioSlugAction } from "@/features/profile/slug-actions";

export function SetupSlugForm() {
  return (
    <form action={savePortfolioSlugAction} className="mt-6 space-y-4">
      <div>
        <label htmlFor="slug" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Endereço (slug)
        </label>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">/u/</span>
          <input
            id="slug"
            name="slug"
            type="text"
            required
            autoComplete="off"
            placeholder="ex.: joao-silva"
            className="min-w-[200px] flex-1 rounded-lg border border-white/15 bg-gray-900/70 px-3 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
          />
        </div>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Apenas letras minúsculas, números e hífens. Mínimo 3 caracteres.
        </p>
      </div>
      <button
        type="submit"
        className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-purple-700 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-950/40 transition hover:from-violet-500 hover:to-purple-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        Continuar para meu portfólio
      </button>
    </form>
  );
}
