import Link from "next/link";

import { resetPasswordAction } from "@/features/auth/password-actions";
import {
  authAlertAmber,
  authAlertError,
  authAlertMuted,
  authCardClass,
  authInputClass,
  authLinkClass,
  authMutedText,
  authPrimaryButtonClass,
  authTitleClass,
} from "@/features/marketing/components/auth-marketing-classes";
import MarketingShell from "@/features/marketing/components/MarketingShell";
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
    <MarketingShell navActive="none">
      <main className="flex min-h-[calc(100vh-1px)] flex-col px-4 pb-24 pt-24 sm:px-6 sm:pt-28">
        <div className="flex flex-1 flex-col items-center justify-center">
          <section className={authCardClass}>
            <h1 className={authTitleClass}>Nova senha</h1>
            <p className={`mt-1 ${authMutedText}`}>
              Defina uma nova senha para sua conta (mínimo {MIN_PASSWORD_LENGTH} caracteres).
            </p>

            {resetErr === "1" && resetErrorMessage ? (
              <p className={authAlertAmber}>{resetErrorMessage}</p>
            ) : null}

            {resetErr === "2" && resetErrorMessage ? (
              <p className={authAlertError}>{resetErrorMessage}</p>
            ) : null}

            {!hasToken && !resetErr ? (
              <p className={authAlertMuted}>Acesse esta página pelo link enviado ao seu e-mail.</p>
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
                  className={authInputClass}
                />
                <input
                  name="confirm"
                  type="password"
                  placeholder="Confirmar senha"
                  required
                  minLength={MIN_PASSWORD_LENGTH}
                  autoComplete="new-password"
                  className={authInputClass}
                />
                <button type="submit" className={authPrimaryButtonClass}>
                  Salvar nova senha
                </button>
              </form>
            ) : null}

            <p className={`mt-4 ${authMutedText}`}>
              <Link href="/login" className={authLinkClass}>
                Ir para o login
              </Link>
              {" · "}
              <Link href="/forgot-password" className={authLinkClass}>
                Novo link
              </Link>
            </p>
          </section>
        </div>
      </main>
    </MarketingShell>
  );
}
