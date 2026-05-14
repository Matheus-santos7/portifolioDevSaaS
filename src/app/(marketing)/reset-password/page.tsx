import Link from "next/link";

import { resetPasswordAction } from "@/features/auth/password-actions";
import HeaderMarketing from "@/features/marketing/components/HeaderMarketing";
import { RESET_PASSWORD_ERROR_MESSAGES } from "@/lib/auth/error-messages";
import { MIN_PASSWORD_LENGTH } from "@/lib/auth/password";

type ResetPasswordPageProps = {
  searchParams: Promise<{ token?: string; err?: string }>;
};

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const params = await searchParams;
  const token = params.token ?? "";
  const hasToken = token.length > 0;
  const resetErr = params.err;
  const resetErrorMessage = resetErr ? RESET_PASSWORD_ERROR_MESSAGES[resetErr] : undefined;
  const showForm = hasToken && resetErr !== "1";

  return (
    <HeaderMarketing navActive="none">
      <main className="flex min-h-[calc(100vh-1px)] flex-col px-4 pb-24 pt-24 sm:px-6 sm:pt-28">
        <div className="flex flex-1 flex-col items-center justify-center">
          <section className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-xl shadow-black/30 backdrop-blur-sm sm:p-8">
            <h1 className="text-2xl font-bold text-white">Nova senha</h1>
            <p className="mt-1 text-sm text-gray-400">
              Defina uma nova senha para sua conta (mínimo {MIN_PASSWORD_LENGTH} caracteres).
            </p>

            {resetErr === "1" && resetErrorMessage ? (
              <p className="mt-4 rounded-lg border border-amber-500/30 bg-amber-950/35 px-3 py-2 text-sm text-amber-200">
                {resetErrorMessage}
              </p>
            ) : null}

            {resetErr === "2" && resetErrorMessage ? (
              <p className="mt-4 rounded-lg border border-red-500/30 bg-red-950/40 px-3 py-2 text-sm text-red-200">
                {resetErrorMessage}
              </p>
            ) : null}

            {!hasToken && !resetErr ? (
              <p className="mt-4 rounded-lg border border-white/10 bg-white/[0.06] px-3 py-2 text-sm text-gray-300">
                Acesse esta página pelo link enviado ao seu e-mail.
              </p>
            ) : null}

            {showForm ? (
              <form action={resetPasswordAction} className="mt-6 space-y-4">
                <input type="hidden" name="token" value={token} />
                <input
                  name="password"
                  type="password"
                  placeholder="Nova senha"
                  required
                  minLength={MIN_PASSWORD_LENGTH}
                  autoComplete="new-password"
                  className="w-full rounded-lg border border-white/15 bg-gray-900/70 px-3 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
                <input
                  name="confirm"
                  type="password"
                  placeholder="Confirmar senha"
                  required
                  minLength={MIN_PASSWORD_LENGTH}
                  autoComplete="new-password"
                  className="w-full rounded-lg border border-white/15 bg-gray-900/70 px-3 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
                <button
                  type="submit"
                  className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-purple-700 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-950/40 transition hover:from-violet-500 hover:to-purple-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Salvar nova senha
                </button>
              </form>
            ) : null}

            <p className="mt-4 text-sm text-gray-400">
              <Link
                href="/login"
                className="font-medium text-violet-400 transition hover:text-violet-300 hover:underline"
              >
                Ir para o login
              </Link>
              {" · "}
              <Link
                href="/forgot-password"
                className="font-medium text-violet-400 transition hover:text-violet-300 hover:underline"
              >
                Novo link
              </Link>
            </p>
          </section>
        </div>
      </main>
    </HeaderMarketing>
  );
}
