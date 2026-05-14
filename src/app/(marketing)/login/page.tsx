import Link from "next/link";

import { loginAction } from "@/features/auth/actions";
import HeaderMarketing from "@/features/marketing/components/HeaderMarketing";
import { LOGIN_ERROR_MESSAGES } from "@/lib/auth/error-messages";

type LoginPageProps = {
  searchParams: Promise<{
    err?: string;
    reset?: string;
    email?: string;
    existing?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const prefilledEmail = (params.email ?? "").trim();
  const showExistingAccountHint = params.existing === "1";
  const loginErrorMessage = params.err ? LOGIN_ERROR_MESSAGES[params.err] : undefined;

  return (
    <HeaderMarketing navActive="login">
      <main className="flex min-h-[calc(100vh-1px)] flex-col px-4 pb-24 pt-24 sm:px-6 sm:pt-28">
        <div className="flex flex-1 flex-col items-center justify-center">
          <section className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-xl shadow-black/30 backdrop-blur-sm sm:p-8">
            <h1 className="text-2xl font-bold text-white">Entrar</h1>
            <p className="mt-1 text-sm text-gray-400">Acesse para criar/editar seu portfólio.</p>

            {params.reset === "ok" ? (
              <p className="mt-4 rounded-lg border border-emerald-500/30 bg-emerald-950/35 px-3 py-2 text-sm text-emerald-200">
                Senha alterada com sucesso. Entre com a nova senha.
              </p>
            ) : null}

            {showExistingAccountHint ? (
              <p className="mt-4 rounded-lg border border-violet-500/30 bg-violet-950/35 px-3 py-2 text-sm text-violet-100">
                Este e-mail já possui cadastro. Informe sua senha para entrar.
              </p>
            ) : null}

            {loginErrorMessage ? (
              <p className="mt-4 rounded-lg border border-red-500/30 bg-red-950/40 px-3 py-2 text-sm text-red-200">
                {loginErrorMessage}
              </p>
            ) : null}

            <form action={loginAction} className="mt-6 space-y-4">
              <input
                name="email"
                type="email"
                placeholder="Email"
                required
                autoComplete="email"
                defaultValue={prefilledEmail}
                className="w-full rounded-lg border border-white/15 bg-gray-900/70 px-3 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
              />
              <input
                name="password"
                type="password"
                placeholder="Senha"
                required
                autoComplete="current-password"
                className="w-full rounded-lg border border-white/15 bg-gray-900/70 px-3 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                autoFocus={showExistingAccountHint}
              />
              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-purple-700 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-950/40 transition hover:from-violet-500 hover:to-purple-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Entrar
              </button>
            </form>

            <p className="mt-4 text-sm text-gray-400">
              <Link
                href="/forgot-password"
                className="font-medium text-violet-400 transition hover:text-violet-300 hover:underline"
              >
                Esqueci minha senha
              </Link>
            </p>

            <p className="mt-4 text-sm text-gray-400">
              Não tem conta?{" "}
              <Link
                href="/register"
                className="font-medium text-violet-400 transition hover:text-violet-300 hover:underline"
              >
                Criar conta
              </Link>
            </p>
          </section>
        </div>
      </main>
    </HeaderMarketing>
  );
}
