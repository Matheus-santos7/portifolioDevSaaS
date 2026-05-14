"use client";

import { Award, Code, FileDown, Layout, Menu, MessageCircle, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { DarkModeToggle } from "@/app/layout/DarkModeToggle";

export type PublicPortfolioHeaderProps = {
  /** Texto entre `< … />` no cabeçalho (ex.: nome público como nas capturas). */
  bracketLabel: string;
  isAuthenticated: boolean;
  /** URL do currículo em PDF armazenado no sistema. */
  curriculumHref?: string | null;
  phone?: string | null;
};

function whatsappHref(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return null;
  return `https://wa.me/${digits}`;
}

export default function PublicPortfolioHeader({
  bracketLabel,
  isAuthenticated,
  curriculumHref,
  phone,
}: PublicPortfolioHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, []);

  const closeNav = () => setMenuOpen(false);
  const curriculumLink = curriculumHref?.trim() ?? "";
  const whatsappRaw = whatsappHref(phone?.trim() ?? "");

  const display = bracketLabel.trim() || "portfólio";

  return (
    <header className="fixed z-50 w-full bg-white shadow-sm dark:bg-gray-800">
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 flex-col gap-0.5">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg outline-none transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800"
          >
            <Layout className="h-8 w-8 shrink-0 text-indigo-600 dark:text-indigo-400" aria-hidden />
            <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
              PageDEV SaaS
            </span>
          </Link>
          {display && display !== "portfólio" ? (
            <span className="truncate pl-11 text-xs text-gray-500 dark:text-gray-400">{display}</span>
          ) : null}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            className="rounded-md p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-gray-100 dark:focus:ring-indigo-400"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <X className="h-7 w-7" aria-hidden /> : <Menu className="h-7 w-7" aria-hidden />}
          </button>
          <DarkModeToggle />
        </div>
      </div>

      <nav
        className={`fixed inset-y-0 right-0 z-[100] flex w-72 max-w-full transform flex-col bg-white shadow-lg transition-transform duration-300 dark:bg-gray-900 ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="Menu"
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
          <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">Menu</span>
          <button
            type="button"
            className="rounded p-2 text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-gray-300 dark:hover:bg-gray-800"
            onClick={() => setMenuOpen(false)}
            aria-label="Fechar menu"
          >
            <X className="h-6 w-6" aria-hidden />
          </button>
        </div>
        <ul className="flex flex-1 flex-col gap-1 px-4 py-4">
          {curriculumLink ? (
            <li>
              <a
                href={curriculumLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeNav}
                className="flex items-center rounded-md px-3 py-2 text-gray-900 transition hover:bg-indigo-50 dark:text-gray-100 dark:hover:bg-indigo-900/40"
              >
                <FileDown className="mr-3 h-5 w-5" aria-hidden />
                Currículo
              </a>
            </li>
          ) : null}
          {whatsappRaw ? (
            <li>
              <a
                href={whatsappRaw}
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeNav}
                className="flex items-center rounded-md px-3 py-2 text-gray-900 transition hover:bg-green-50 dark:text-gray-100 dark:hover:bg-green-900/30"
              >
                <MessageCircle className="mr-3 h-5 w-5" aria-hidden />
                WhatsApp
              </a>
            </li>
          ) : null}
          <li>
            <Link
              href="#projetos"
              onClick={closeNav}
              className="flex items-center rounded-md px-3 py-2 text-gray-900 transition hover:bg-indigo-50 dark:text-gray-100 dark:hover:bg-indigo-900/40"
            >
              <Code className="mr-3 h-5 w-5" aria-hidden />
              Projetos
            </Link>
          </li>
          <li>
            <Link
              href="#certificados"
              onClick={closeNav}
              className="flex items-center rounded-md px-3 py-2 text-gray-900 transition hover:bg-yellow-50 dark:text-gray-100 dark:hover:bg-yellow-900/25"
            >
              <Award className="mr-3 h-5 w-5" aria-hidden />
              Certificações
            </Link>
          </li>
        </ul>
        <div className="border-t border-gray-200 px-4 py-5 dark:border-gray-700">
          <Link
            href={isAuthenticated ? "/dashboard" : "/login"}
            onClick={closeNav}
            className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950/60"
          >
            <Layout className="mr-2 h-4 w-4" aria-hidden />
            {isAuthenticated ? "Gerir portfólio" : "Entrar"}
          </Link>
        </div>
      </nav>

      {menuOpen ? (
        <div
          className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      ) : null}
    </header>
  );
}
