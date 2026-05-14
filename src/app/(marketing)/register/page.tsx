import Link from "next/link";

import { registerAction } from "@/features/auth/actions";
import HeaderMarketing from "@/features/marketing/components/HeaderMarketing";
import { REGISTER_ERROR_MESSAGES } from "@/lib/auth/error-messages";
import { MIN_PASSWORD_LENGTH } from "@/lib/auth/password";

type RegisterPageProps = {
  searchParams: Promise<{ err?: string }>;
};

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const params = await searchParams;
  const registerErrorMessage = params.err ? REGISTER_ERROR_MESSAGES[params.err] : undefined;

  return (
    <HeaderMarketing navActive="register">
      <main className="flex min-h-[calc(100vh-1px)] flex-col px-4 pb-24 pt-24 sm:px-6 sm:pt-28">
        <div className="flex flex-1 flex-col items-center justify-center">
          <section className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-xl shadow-black/30 backdrop-blur-sm sm:p-8">
            <h1 className="text-2xl font-bold text-white">Criar conta</h1>
            <p className="mt-1 text-sm text-gray-400">Comece seu portfólio em minutos — é grátis.</p>

            {registerErrorMessage ? (
              <p className="mt-4 rounded-lg border border-red-500/30 bg-red-950/40 px-3 py-2 text-sm text-red-200">
                {registerErrorMessage}
              </p>
            ) : null}

            <form action={registerAction} className="mt-6 space-y-4">
              <input
                name="name"
                type="text"
                placeholder="Seu nome"
                required
                autoComplete="name"
                className="w-full rounded-lg border border-white/15 bg-gray-900/70 px-3 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
              />
              <input
                name="email"
                type="email"
                placeholder="Email"
                required
                autoComplete="email"
                className="w-full rounded-lg border border-white/15 bg-gray-900/70 px-3 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
              />
              <input
                name="password"
                type="password"
                minLength={MIN_PASSWORD_LENGTH}
                placeholder={`Senha (mínimo ${MIN_PASSWORD_LENGTH} caracteres)`}
                required
                autoComplete="new-password"
                className="w-full rounded-lg border border-white/15 bg-gray-900/70 px-3 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
              />
              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-purple-700 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-950/40 transition hover:from-violet-500 hover:to-purple-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Criar conta
              </button>
            </form>

            <p className="mt-4 text-sm text-gray-400">
              Já possui conta?{" "}
              <Link
                href="/login"
                className="font-medium text-violet-400 transition hover:text-violet-300 hover:underline"
              >
                Entrar
              </Link>
            </p>
          </section>
        </div>
      </main>
    </HeaderMarketing>
  );
}
