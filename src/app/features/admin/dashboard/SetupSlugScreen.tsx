import Link from "next/link";
import { redirect } from "next/navigation";

import { logoutAction } from "@/app/core/auth/actions";
import { SetupSlugForm } from "@/app/features/admin/profile/SetupSlugForm";
import HeaderMarketing from "@/app/features/public/marketing/components/HeaderMarketing";
import { requireCurrentProfile } from "@/app/lib/auth/current-profile";

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
    <HeaderMarketing navActive="none">
      <main className="flex min-h-[calc(100vh-1px)] flex-col px-4 pb-24 pt-24 sm:px-6 sm:pt-28">
        <div className="flex flex-1 flex-col items-center justify-center">
          <section className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-xl shadow-black/30 backdrop-blur-sm sm:p-8">
            <h1 className="text-2xl font-bold text-white">Seu endereço público</h1>
            <p className="mt-1 text-sm text-gray-400">
              Escolha o caminho do seu portfólio. Ele ficará em{" "}
              <span className="font-mono text-violet-600 dark:text-violet-400">/u/seu-endereco</span>{" "}
              para você compartilhar.
            </p>
            <p className="mt-2 text-sm text-gray-400">
              Você verá a página como visitantes veem. Ao entrar logado, poderá editar com o ícone de
              lápis.
            </p>

            {errMsg ? (
              <p className="mt-4 rounded-lg border border-red-500/30 bg-red-950/40 px-3 py-2 text-sm text-red-200">
                {errMsg}
              </p>
            ) : null}

            <SetupSlugForm />

            <form action={logoutAction} className="mt-6">
              <button
                type="submit"
                className="text-sm text-gray-500 underline hover:text-gray-700 dark:hover:text-gray-300"
              >
                Sair e usar outra conta
              </button>
            </form>

            <p className="mt-4 text-sm text-gray-400">
              <Link href="/login" className="text-violet-600 hover:underline dark:text-violet-400">
                Voltar ao login
              </Link>
            </p>
          </section>
        </div>
      </main>
    </HeaderMarketing>
  );
}
