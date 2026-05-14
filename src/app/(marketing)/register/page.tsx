import Link from "next/link";

import { registerAction } from "@/features/auth/actions";
import {
  authAlertError,
  authCardClass,
  authInputClass,
  authLinkClass,
  authMutedText,
  authPrimaryButtonClass,
  authTitleClass,
} from "@/features/marketing/components/auth-marketing-classes";
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
          <section className={authCardClass}>
            <h1 className={authTitleClass}>Criar conta</h1>
            <p className={`mt-1 ${authMutedText}`}>Comece seu portfólio em minutos — é grátis.</p>

            {registerErrorMessage ? <p className={authAlertError}>{registerErrorMessage}</p> : null}

            <form action={registerAction} className="mt-6 space-y-4">
              <input
                name="name"
                type="text"
                placeholder="Seu nome"
                required
                autoComplete="name"
                className={authInputClass}
              />
              <input
                name="email"
                type="email"
                placeholder="Email"
                required
                autoComplete="email"
                className={authInputClass}
              />
              <input
                name="password"
                type="password"
                minLength={MIN_PASSWORD_LENGTH}
                placeholder={`Senha (mínimo ${MIN_PASSWORD_LENGTH} caracteres)`}
                required
                autoComplete="new-password"
                className={authInputClass}
              />
              <button type="submit" className={authPrimaryButtonClass}>
                Criar conta
              </button>
            </form>

            <p className={`mt-4 ${authMutedText}`}>
              Já possui conta?{" "}
              <Link href="/login" className={authLinkClass}>
                Entrar
              </Link>
            </p>
          </section>
        </div>
      </main>
    </HeaderMarketing>
  );
}
