import Link from "next/link";

import { loginAction } from "@/features/auth/actions";
import {
  authAlertError,
  authAlertInfo,
  authAlertSuccess,
  authCardClass,
  authInputClass,
  authLinkClass,
  authMutedText,
  authPrimaryButtonClass,
  authTitleClass,
} from "@/features/marketing/components/auth-marketing-classes";
import MarketingShell from "@/features/marketing/components/MarketingShell";
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
    <MarketingShell navActive="login">
      <main className="flex min-h-[calc(100vh-1px)] flex-col px-4 pb-24 pt-24 sm:px-6 sm:pt-28">
        <div className="flex flex-1 flex-col items-center justify-center">
          <section className={authCardClass}>
            <h1 className={authTitleClass}>Entrar</h1>
            <p className={`mt-1 ${authMutedText}`}>Acesse para criar/editar seu portfólio.</p>

            {params.reset === "ok" ? (
              <p className={authAlertSuccess}>
                Senha alterada com sucesso. Entre com a nova senha.
              </p>
            ) : null}

            {showExistingAccountHint ? (
              <p className={authAlertInfo}>
                Este e-mail já possui cadastro. Informe sua senha para entrar.
              </p>
            ) : null}

            {loginErrorMessage ? <p className={authAlertError}>{loginErrorMessage}</p> : null}

            <form action={loginAction} className="mt-6 space-y-4">
              <input
                name="email"
                type="email"
                placeholder="Email"
                required
                autoComplete="email"
                defaultValue={prefilledEmail}
                className={authInputClass}
              />
              <input
                name="password"
                type="password"
                placeholder="Senha"
                required
                autoComplete="current-password"
                className={authInputClass}
                autoFocus={showExistingAccountHint}
              />
              <button type="submit" className={authPrimaryButtonClass}>
                Entrar
              </button>
            </form>

            <p className={`mt-4 ${authMutedText}`}>
              <Link href="/forgot-password" className={authLinkClass}>
                Esqueci minha senha
              </Link>
            </p>

            <p className={`mt-4 ${authMutedText}`}>
              Não tem conta?{" "}
              <Link href="/register" className={authLinkClass}>
                Criar conta
              </Link>
            </p>
          </section>
        </div>
      </main>
    </MarketingShell>
  );
}
