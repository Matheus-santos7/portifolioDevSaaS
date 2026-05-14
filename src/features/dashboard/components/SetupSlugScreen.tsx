import Link from "next/link";
import { redirect } from "next/navigation";

import { logoutAction } from "@/features/auth/actions";
import {
  authAlertError,
  authCardClass,
  authMutedText,
  authTitleClass,
} from "@/features/marketing/components/auth-marketing-classes";
import MarketingShell from "@/features/marketing/components/MarketingShell";
import { SetupSlugForm } from "@/features/profile/components/SetupSlugForm";
import { requireCurrentProfile } from "@/lib/auth/current-profile";

const ERRORS: Record<string, string> = {
  "1": "Use pelo menos 3 caracteres válidos (letras, números ou hífen).",
  "2": "Endereço muito longo (máximo 48 caracteres).",
  "3": "Esse endereço é reservado pelo sistema. Escolha outro.",
  "4": "Esse endereço já está em uso. Tente outro.",
};

type SetupSlugScreenProps = {
  searchParams: Promise<{ err?: string }>;
};

export default async function SetupSlugScreen({
  searchParams,
}: SetupSlugScreenProps) {
  const profile = await requireCurrentProfile();
  if (profile.slugOnboardingDone) {
    redirect("/dashboard");
  }

  const params = await searchParams;
  const errMsg = params.err ? ERRORS[params.err] : undefined;

  return (
    <MarketingShell navActive="none">
      <main className="flex min-h-[calc(100vh-1px)] flex-col px-4 pb-24 pt-24 sm:px-6 sm:pt-28">
        <div className="flex flex-1 flex-col items-center justify-center">
          <section className={authCardClass}>
            <h1 className={authTitleClass}>Seu endereço público</h1>
            <p className={`mt-1 ${authMutedText}`}>
              Escolha o caminho do seu portfólio. Ele ficará em{" "}
              <span className="font-mono text-violet-600 dark:text-violet-400">/u/seu-endereco</span>{" "}
              para você compartilhar.
            </p>
            <p className={`mt-2 text-sm ${authMutedText}`}>
              Você verá a página como visitantes veem. Ao entrar logado, poderá editar com o ícone de
              lápis.
            </p>

            {errMsg ? <p className={authAlertError}>{errMsg}</p> : null}

            <SetupSlugForm />

            <form action={logoutAction} className="mt-6">
              <button
                type="submit"
                className="text-sm text-gray-500 underline hover:text-gray-700 dark:hover:text-gray-300"
              >
                Sair e usar outra conta
              </button>
            </form>

            <p className={`mt-4 ${authMutedText}`}>
              <Link href="/login" className="text-violet-600 hover:underline dark:text-violet-400">
                Voltar ao login
              </Link>
            </p>
          </section>
        </div>
      </main>
    </MarketingShell>
  );
}
