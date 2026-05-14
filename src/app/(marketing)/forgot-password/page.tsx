import Link from "next/link";

import { requestPasswordResetAction } from "@/features/auth/password-actions";
import HeaderMarketing from "@/features/marketing/components/HeaderMarketing";
import { FORGOT_PASSWORD_ERROR_MESSAGES } from "@/lib/auth/error-messages";

type ForgotPasswordPageProps = {
  searchParams: Promise<{ err?: string; sent?: string; email?: string; needsPassword?: string }>;
};

export default async function ForgotPasswordPage({
  searchParams,
}: ForgotPasswordPageProps) {
  const params = await searchParams;
  const forgotErrorMessage = params.err ? FORGOT_PASSWORD_ERROR_MESSAGES[params.err] : undefined;
  const prefilledEmail = (params.email ?? "").trim();
  const showNeedsPasswordHint = params.needsPassword === "1";

  return (
    <HeaderMarketing navActive="none">
      <main className="flex min-h-[calc(100vh-1px)] flex-col px-4 pb-24 pt-24 sm:px-6 sm:pt-28">
        <div className="flex flex-1 flex-col items-center justify-center">
          <section className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-xl shadow-black/30 backdrop-blur-sm sm:p-8">
            <h1 className="text-2xl font-bold text-white">Recuperar senha</h1>
            <p className="mt-1 text-sm text-gray-400">
              Informe seu e-mail. Se existir uma conta, enviaremos um link para redefinir a senha.
            </p>

            {forgotErrorMessage ? (
              <p className="mt-4 rounded-lg border border-red-500/30 bg-red-950/40 px-3 py-2 text-sm text-red-200">
                {forgotErrorMessage}
              </p>
            ) : null}

            {showNeedsPasswordHint ? (
              <p className="mt-4 rounded-lg border border-violet-500/30 bg-violet-950/35 px-3 py-2 text-sm text-violet-100">
                Este e-mail já está cadastrado, mas sem senha neste sistema. Envie o link abaixo
                para definir a primeira senha pela mesma rota de recuperação.
              </p>
            ) : null}

            {params.sent === "1" ? (
              <p className="mt-4 rounded-lg border border-emerald-500/30 bg-emerald-950/35 px-3 py-2 text-sm text-emerald-200">
                Se o e-mail estiver cadastrado, você receberá as instruções em instantes. Verifique
                também a pasta de spam.
              </p>
            ) : null}

            <form action={requestPasswordResetAction} className="mt-6 space-y-4">
              <input
                name="email"
                type="email"
                placeholder="Email"
                required
                autoComplete="email"
                defaultValue={prefilledEmail || undefined}
                className="w-full rounded-lg border border-white/15 bg-gray-900/70 px-3 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
              />
              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-purple-700 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-950/40 transition hover:from-violet-500 hover:to-purple-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Enviar link
              </button>
            </form>

            <p className="mt-4 text-sm text-gray-400">
              <Link
                href="/login"
                className="font-medium text-violet-400 transition hover:text-violet-300 hover:underline"
              >
                Voltar ao login
              </Link>
            </p>
          </section>
        </div>
      </main>
    </HeaderMarketing>
  );
}
