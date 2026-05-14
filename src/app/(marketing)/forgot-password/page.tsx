import Link from "next/link";

import { requestPasswordResetAction } from "@/features/auth/password-actions";
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
    <MarketingShell navActive="none">
      <main className="flex min-h-[calc(100vh-1px)] flex-col px-4 pb-24 pt-24 sm:px-6 sm:pt-28">
        <div className="flex flex-1 flex-col items-center justify-center">
          <section className={authCardClass}>
            <h1 className={authTitleClass}>Recuperar senha</h1>
            <p className={`mt-1 ${authMutedText}`}>
              Informe seu e-mail. Se existir uma conta, enviaremos um link para redefinir a senha.
            </p>

            {forgotErrorMessage ? <p className={authAlertError}>{forgotErrorMessage}</p> : null}

            {showNeedsPasswordHint ? (
              <p className={authAlertInfo}>
                Este e-mail já está cadastrado, mas sem senha neste sistema. Envie o link abaixo
                para definir a primeira senha pela mesma rota de recuperação.
              </p>
            ) : null}

            {params.sent === "1" ? (
              <p className={authAlertSuccess}>
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
                className={authInputClass}
              />
              <button type="submit" className={authPrimaryButtonClass}>
                Enviar link
              </button>
            </form>

            <p className={`mt-4 ${authMutedText}`}>
              <Link href="/login" className={authLinkClass}>
                Voltar ao login
              </Link>
            </p>
          </section>
        </div>
      </main>
    </MarketingShell>
  );
}
