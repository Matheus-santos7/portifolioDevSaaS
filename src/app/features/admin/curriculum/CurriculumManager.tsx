"use client";

import { FileDown, Loader2, Trash2, Upload } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

import { isVercelBlobUrl } from "@/app/lib/storage/blob-url";

type CurriculumManagerProps = {
  slug: string;
  curriculum: string | null;
};

export function CurriculumManager({ slug, curriculum }: CurriculumManagerProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const publicPreviewHref = `/u/${encodeURIComponent(slug)}`;

  const refreshState = useCallback(() => {
    router.refresh();
  }, [router]);

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || pending) return;
    setPending(true);
    setMessage(null);
    try {
      const fd = new FormData();
      fd.set("file", file);
      const res = await fetch("/api/account/curriculum", {
        method: "POST",
        body: fd,
        credentials: "include",
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setMessage(json.error ?? "Não foi possível enviar o PDF.");
        return;
      }
      setMessage("Currículo atualizado. Visível na página pública.");
      refreshState();
    } finally {
      setPending(false);
    }
  }

  async function onRemovePdf() {
    if (pending) return;
    setPending(true);
    setMessage(null);
    try {
      const res = await fetch("/api/account/curriculum", {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const json = (await res.json().catch(() => ({}))) as { error?: string };
        setMessage(json.error ?? "Não foi possível remover o PDF.");
        return;
      }
      setMessage("Currículo público removido.");
      refreshState();
    } finally {
      setPending(false);
    }
  }

  const trimmedCv = curriculum?.trim() ?? "";
  const hasLink =
    trimmedCv.startsWith("/") ||
    trimmedCv.startsWith("http://") ||
    trimmedCv.startsWith("https://");
  const blobPdf = Boolean(trimmedCv && isVercelBlobUrl(trimmedCv));

  return (
    <section className="mb-10 rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        Currículo público
      </h2>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
        Visitantes podem abrir o currículo no menu da página{" "}
        <Link
          href={publicPreviewHref}
          className="font-medium text-indigo-600 underline-offset-2 hover:underline dark:text-indigo-400"
        >
          /u/{slug}
        </Link>
        .
      </p>

      {hasLink && !blobPdf ? (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Está definido um{" "}
          <a
            href={trimmedCv}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-indigo-600 underline-offset-2 hover:underline dark:text-indigo-400"
          >
            link externo
          </a>
          . Carregar um PDF abaixo substitui esse link pelo ficheiro no armazenamento.
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50">
          {pending ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : (
            <Upload className="h-4 w-4" aria-hidden />
          )}
          {pending ? "A enviar…" : "Carregar PDF"}
          <input
            type="file"
            accept="application/pdf,.pdf"
            className="sr-only"
            disabled={pending}
            onChange={onUpload}
          />
        </label>

        {hasLink ? (
          <>
            <a
              href={trimmedCv}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-700"
            >
              <FileDown className="h-4 w-4 shrink-0" aria-hidden />
              Abrir currículo
            </a>
            {blobPdf ? (
              <button
                type="button"
                onClick={() => void onRemovePdf()}
                disabled={pending}
                className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm text-red-700 hover:bg-red-50 disabled:opacity-50 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950/40"
              >
                <Trash2 className="h-4 w-4" aria-hidden />
                Remover PDF
              </button>
            ) : (
              <button
                type="button"
                onClick={() => void onRemovePdf()}
                disabled={pending}
                className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm text-red-700 hover:bg-red-50 disabled:opacity-50 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950/40"
              >
                <Trash2 className="h-4 w-4" aria-hidden />
                Remover link
              </button>
            )}
          </>
        ) : null}
      </div>

      {!hasLink ? (
        <p className="mt-3 text-sm text-amber-800 dark:text-amber-200/90">
          Ainda sem currículo público — carregue um PDF.
        </p>
      ) : null}

      {message ? (
        <p className="mt-3 text-sm text-gray-700 dark:text-gray-300">{message}</p>
      ) : null}

      <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
        PDF: máximo 4 MB. Visitantes só veem o currículo se o perfil for público.
      </p>
    </section>
  );
}
