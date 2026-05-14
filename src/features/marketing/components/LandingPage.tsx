import {
  ArrowRight,
  Link2,
  Palette,
  Rocket,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

import MarketingShell from "@/features/marketing/components/MarketingShell";

export default function LandingPage() {
  return (
    <MarketingShell navActive="home">
      <main>
        <section className="relative overflow-hidden px-4 pb-20 pt-28 sm:px-6 sm:pt-32 lg:pb-28">
          <div
            className="pointer-events-none absolute -left-40 top-20 h-80 w-80 rounded-full bg-violet-600/35 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -right-40 top-40 h-80 w-80 rounded-full bg-purple-700/25 blur-3xl"
            aria-hidden
          />

          <div className="relative mx-auto max-w-4xl text-center">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/35 bg-violet-500/10 px-4 py-1 text-xs font-medium uppercase tracking-wider text-violet-200">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              100% gratuito para desenvolvedores
            </p>
            <h1 className="text-balance bg-gradient-to-br from-white via-gray-100 to-gray-400 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl lg:text-6xl">
              Seu portfólio público em um link. Pronto para LinkedIn e currículo.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-gray-400 sm:text-xl">
              Cadastre-se, adicione projetos e habilidades e compartilhe uma página limpa no formato{" "}
              <code className="rounded bg-white/10 px-1.5 py-0.5 text-sm text-violet-200">
                /u/seu-slug
              </code>
              . Sem custo — foque em mostrar o que você constrói.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-gray-900 shadow-xl transition hover:bg-gray-100"
              >
                Começar agora
                <ArrowRight className="h-5 w-5" aria-hidden />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-8 py-3.5 text-base font-medium text-white transition hover:bg-white/10"
              >
                Já tenho conta
              </Link>
            </div>
          </div>
        </section>

        <section className="border-t border-white/10 bg-gray-950/50 px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center text-2xl font-bold text-white sm:text-3xl">Por que usar?</h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-gray-400">
              Tudo que você precisa para uma primeira impressão sólida em processos seletivos e
              networking.
            </p>
            <ul className="mt-14 grid gap-8 sm:grid-cols-3">
              <li className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 transition hover:border-violet-500/35">
                <div className="mb-4 inline-flex rounded-lg bg-violet-500/15 p-3 text-violet-300">
                  <Palette className="h-6 w-6" aria-hidden />
                </div>
                <h3 className="text-lg font-semibold text-white">Página só sua</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-400">
                  URL estável para colar no LinkedIn, CV e assinatura de e-mail. Quem abre vê só o
                  seu trabalho.
                </p>
              </li>
              <li className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 transition hover:border-purple-500/35">
                <div className="mb-4 inline-flex rounded-lg bg-purple-500/15 p-3 text-purple-300">
                  <Rocket className="h-6 w-6" aria-hidden />
                </div>
                <h3 className="text-lg font-semibold text-white">Edição rápida</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-400">
                  Faça login, atualize projetos e skills quando quiser. As mudanças aparecem na hora
                  no seu link público.
                </p>
              </li>
              <li className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 transition hover:border-emerald-500/30">
                <div className="mb-4 inline-flex rounded-lg bg-emerald-500/15 p-3 text-emerald-300">
                  <Link2 className="h-6 w-6" aria-hidden />
                </div>
                <h3 className="text-lg font-semibold text-white">Grátis</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-400">
                  Sem cartão de crédito. Ideal para quem está começando ou quer um hub simples além
                  do GitHub.
                </p>
              </li>
            </ul>
          </div>
        </section>

        <section className="px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-3xl rounded-2xl border border-violet-500/25 bg-gradient-to-br from-violet-950/50 to-purple-950/45 p-10 text-center sm:p-14">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">Pronto em três passos</h2>
            <ol className="mt-8 space-y-4 text-left text-gray-300">
              <li className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-violet-200">
                  1
                </span>
                <span>Crie sua conta gratuita com e-mail e senha.</span>
              </li>
              <li className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-violet-200">
                  2
                </span>
                <span>No painel, cadastre projetos e habilidades do seu portfólio.</span>
              </li>
              <li className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-violet-200">
                  3
                </span>
                <span>
                  Copie seu link público{" "}
                  <strong className="text-white">(ex.: /u/meu-nome-abc123)</strong> e divulgue.
                </span>
              </li>
            </ol>
            <Link
              href="/register"
              className="mt-10 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-700 px-8 py-3.5 font-semibold text-white shadow-lg shadow-violet-950/40 transition hover:from-violet-500 hover:to-purple-600"
            >
              Criar minha conta
              <ArrowRight className="h-5 w-5" aria-hidden />
            </Link>
          </div>
        </section>
      </main>
    </MarketingShell>
  );
}
