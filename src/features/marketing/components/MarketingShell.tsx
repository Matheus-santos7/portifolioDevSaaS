import { Layout } from "lucide-react";
import Link from "next/link";

import { marketingSurfaceStyle } from "@/features/marketing/components/marketing-surface";

export type MarketingNavActive = "home" | "login" | "register" | "none";

type MarketingShellProps = {
  children: React.ReactNode;
  navActive: MarketingNavActive;
  /** Se definido, substitui os links «Entrar» / «Criar conta». */
  headerRight?: React.ReactNode;
  /** Se false, esconde o bloco Entrar · Registrar no rodapé (ex.: página pública do slug). */
  showFooterAuthLinks?: boolean;
};

const navInactive =
  "rounded-lg px-3 py-2 text-gray-300 transition hover:bg-white/10 hover:text-white";
const navLoginHighlighted =
  "rounded-lg bg-white/10 px-3 py-2 font-medium text-white";

export default function MarketingShell({
  children,
  navActive,
  headerRight,
  showFooterAuthLinks = true,
}: MarketingShellProps) {
  const loginNavClass = navActive === "login" ? navLoginHighlighted : navInactive;
  const registerExtra =
    navActive === "register"
      ? "ring-2 ring-violet-400/80 ring-offset-2 ring-offset-gray-950"
      : "";

  return (
    <div
      className="min-h-screen bg-gray-950 text-gray-100 [color-scheme:dark]"
      style={marketingSurfaceStyle}
    >
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-gray-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight text-white">
            <Layout className="h-8 w-8 text-violet-400" aria-hidden />
            <span>PageDEV SaaS</span>
          </Link>
          <nav className="flex items-center gap-3 text-sm">
            {headerRight ?? (
              <>
                <Link href="/login" className={loginNavClass}>
                  Entrar
                </Link>
                <Link
                  href="/register"
                  className={`rounded-lg bg-gradient-to-r from-violet-600 to-purple-700 px-4 py-2 font-medium text-white shadow-lg shadow-violet-950/50 transition hover:from-violet-500 hover:to-purple-600 ${registerExtra}`}
                >
                  Criar conta grátis
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {children}

      <footer className="border-t border-white/10 px-4 py-10 text-center text-sm text-gray-500 sm:px-6">
        <p>PageDEV SaaS — feito para devs mostrarem o que constroem.</p>
        {showFooterAuthLinks ? (
          <p className="mt-2">
            <Link href="/login" className="text-violet-400 hover:text-violet-300 hover:underline">
              Entrar
            </Link>
            {" · "}
            <Link href="/register" className="text-violet-400 hover:text-violet-300 hover:underline">
              Registrar
            </Link>
          </p>
        ) : null}
      </footer>
    </div>
  );
}
