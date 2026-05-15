"use client";

import {
  Award,
  Check,
  Code,
  FileDown,
  Layout,
  Link2,
  Loader2,
  LogOut,
  Menu,
  MessageCircle,
  Pencil,
  Save,
  X as CloseIcon,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { logoutAction } from "@/app/core/auth/actions";
import { DarkModeToggle } from "@/app/layout/DarkModeToggle";

interface SiteHeaderClientProps {
  name: string;
  domain?: string;
  /** URL pública do currículo em PDF armazenado no sistema. */
  curriculumHref?: string;
  phone?: string;
  isAuthenticated?: boolean;
  isAdmin?: boolean;
}

export default function SiteHeaderClient({
  name,
  domain,
  curriculumHref,
  phone,
  isAuthenticated = false,
  isAdmin = false,
}: SiteHeaderClientProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [displayDomain, setDisplayDomain] = useState(domain?.trim() || name?.trim() || "dominio");
  const [isEditingDomain, setIsEditingDomain] = useState(false);
  const [domainInput, setDomainInput] = useState(displayDomain);
  const [isSavingDomain, setIsSavingDomain] = useState(false);
  const [domainMessage, setDomainMessage] = useState<string | null>(null);

  useEffect(() => {
    const nextDomain = domain?.trim() || name?.trim() || "dominio";
    setDisplayDomain(nextDomain);
    if (!isEditingDomain) setDomainInput(nextDomain);
  }, [domain, name, isEditingDomain]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const handleNav = () => setMenuOpen(false);
  const handleCancelDomainEdit = () => {
    setIsEditingDomain(false);
    setDomainInput(displayDomain);
    setDomainMessage(null);
  };

  async function handleSaveDomain() {
    const value = domainInput.trim();
    if (!value || isSavingDomain) return;

    try {
      setIsSavingDomain(true);
      setDomainMessage(null);

      const response = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: value }),
      });

      const payload = (await response.json().catch(() => ({}))) as {
        slug?: string;
        error?: string;
      };

      if (!response.ok) {
        setDomainMessage(payload.error ?? "Nao foi possivel salvar o dominio.");
        return;
      }

      const nextDomain = payload.slug?.trim() || value;
      setDisplayDomain(nextDomain);
      setDomainInput(nextDomain);
      setIsEditingDomain(false);
      setDomainMessage("Dominio atualizado com sucesso.");
      window.location.reload();
    } catch {
      setDomainMessage("Erro de rede ao salvar dominio.");
    } finally {
      setIsSavingDomain(false);
    }
  }

  return (
    <header
      className={`fixed z-50 mb-8 w-full bg-white shadow-sm transition-all duration-300 ${
        isScrolled ? "shadow-md" : ""
      } dark:bg-gray-800`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-3 rounded-lg outline-none transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800"
          >
            <Layout className="h-8 w-8 shrink-0 text-indigo-600 dark:text-indigo-400" />
            <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
              PageDEV SaaS
            </span>
          </Link>

          {isAuthenticated && isAdmin ? (
            <div className="flex min-w-0 flex-wrap items-center gap-2 border-gray-200 dark:border-gray-600 sm:border-l sm:pl-4">
              {isEditingDomain ? (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Slug / URL
                  </span>
                  <input
                    value={domainInput}
                    onChange={(e) => setDomainInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        void handleSaveDomain();
                      }
                      if (e.key === "Escape") {
                        e.preventDefault();
                        handleCancelDomainEdit();
                      }
                    }}
                    className="w-40 min-w-[8rem] rounded-md border border-gray-300 bg-white px-2 py-1 font-mono text-sm text-gray-900 outline-none ring-0 focus:border-indigo-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 sm:w-44"
                    aria-label="Editar slug público"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => void handleSaveDomain()}
                    disabled={isSavingDomain}
                    className="rounded-md p-1 text-emerald-600 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50 dark:text-emerald-400 dark:hover:bg-emerald-900/30"
                    aria-label="Salvar domínio"
                    title="Salvar domínio"
                  >
                    {isSavingDomain ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelDomainEdit}
                    disabled={isSavingDomain}
                    className="rounded-md p-1 text-gray-500 transition hover:bg-gray-100 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-red-400"
                    aria-label="Cancelar edição do domínio"
                    title="Cancelar edição do domínio"
                  >
                    <CloseIcon className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Página pública</span>
                  <code className="max-w-[min(100%,16rem)] truncate rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-800 dark:bg-gray-700/80 dark:text-gray-100">
                    /u/{displayDomain}
                  </code>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingDomain(true);
                      setDomainInput(displayDomain);
                      setDomainMessage(null);
                    }}
                    className="rounded-md p-1 text-gray-500 transition hover:bg-gray-100 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-indigo-400"
                    aria-label="Editar domínio"
                    title="Editar domínio"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          ) : null}

          {domainMessage ? (
            <span className="inline-flex items-center gap-1 text-xs text-gray-600 dark:text-gray-300 sm:ml-0">
              <Check className="h-3.5 w-3.5" />
              {domainMessage}
            </span>
          ) : null}
        </div>

        <div className="flex items-center space-x-2">
          <button
            className="rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <X className="h-7 w-7" />
            ) : (
              <Menu className="h-7 w-7" />
            )}
          </button>
          <DarkModeToggle />
        </div>

        <nav
          className={`fixed right-0 top-0 z-50 flex h-full w-72 max-w-full transform flex-col bg-white shadow-lg transition-transform duration-300 dark:bg-gray-900 ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          aria-label="Menu principal"
        >
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
            <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
              Menu
            </span>
            <button
              className="rounded p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onClick={() => setMenuOpen(false)}
              aria-label="Fechar menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <ul className="flex flex-1 flex-col gap-2 px-6 py-6">
            {isAuthenticated ? (
              <li>
                <Link
                  href={`/u/${encodeURIComponent(displayDomain)}`}
                  onClick={handleNav}
                  className="flex items-center rounded-md px-3 py-2 transition hover:bg-violet-50 dark:hover:bg-violet-900/35"
                  title="Abrir página pública do perfil"
                >
                  <Link2 className="mr-2 h-5 w-5 shrink-0" aria-hidden />
                  <span className="break-all font-mono text-sm">{`Público: /u/${displayDomain}`}</span>
                </Link>
              </li>
            ) : null}
            {isAuthenticated ? (
              <li>
                <form action={logoutAction} className="w-full">
                  <button
                    type="submit"
                    className="flex w-full items-center rounded-md px-3 py-2 text-left text-gray-900 transition hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-800"
                  >
                    <LogOut className="mr-2 h-5 w-5 shrink-0" aria-hidden />
                    Sair
                  </button>
                </form>
              </li>
            ) : null}
            {isAuthenticated ? (
              <li className="-mx-1 my-1 border-t border-gray-200 dark:border-gray-700" aria-hidden />
            ) : null}
            <li>
              <Link
                onClick={handleNav}
                href={isAuthenticated ? "/dashboard" : "/login"}
                className="flex items-center rounded-md px-3 py-2 transition hover:bg-indigo-50 dark:hover:bg-indigo-800"
              >
                <Layout className="mr-2 h-5 w-5" />
                {isAuthenticated ? "Gerenciar portfolio" : "Entrar"}
              </Link>
            </li>
            {curriculumHref ? (
              <li>
                <Link
                  onClick={handleNav}
                  href={curriculumHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center rounded-md px-3 py-2 transition hover:bg-indigo-50 dark:hover:bg-indigo-800"
                  title="Baixar currículo"
                >
                  <FileDown className="mr-2 h-5 w-5" />
                  Currículo
                </Link>
              </li>
            ) : null}
            <li>
              <button
                onClick={() => {
                  const phoneNumber = phone?.replace(/\D/g, "");
                  window.open(`https://wa.me/${phoneNumber}`, "_blank");
                }}
                className="flex w-full items-center rounded-md px-3 py-2 transition hover:bg-green-50 dark:hover:bg-green-900"
                title="WhatsApp"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                WhatsApp
              </button>
            </li>
            <li>
              <Link
                onClick={handleNav}
                href="#projetos"
                className="flex items-center rounded-md px-3 py-2 transition hover:bg-blue-50 dark:hover:bg-blue-900"
                title="Ir para a seção de projetos"
              >
                <Code className="mr-2 h-5 w-5" />
                Projetos
              </Link>
            </li>
            <li>
              <Link
                onClick={handleNav}
                href="#certificados"
                className="flex items-center rounded-md px-3 py-2 transition hover:bg-yellow-50 dark:hover:bg-yellow-900"
                title="Ir para a seção de certificações"
              >
                <Award className="mr-2 h-5 w-5" />
                Certificações
              </Link>
            </li>
          </ul>
        </nav>

        {menuOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />
        )}
      </div>
    </header>
  );
}
