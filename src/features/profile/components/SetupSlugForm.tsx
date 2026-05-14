"use client";

import {
  authInputClass,
  authPrimaryButtonClass,
} from "@/features/marketing/components/auth-marketing-classes";
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
            className={`min-w-[200px] flex-1 ${authInputClass}`}
          />
        </div>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Apenas letras minúsculas, números e hífens. Mínimo 3 caracteres.
        </p>
      </div>
      <button type="submit" className={authPrimaryButtonClass}>
        Continuar para meu portfólio
      </button>
    </form>
  );
}
