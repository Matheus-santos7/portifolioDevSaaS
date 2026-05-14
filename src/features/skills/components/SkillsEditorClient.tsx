"use client";

import { Level } from "@prisma/client";
import { Loader2, Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";

import { syncSkillsAction } from "@/features/skills/actions";
import SkillsPillsClient from "@/features/skills/components/SkillsPillsClient";
import type { SkillWithTechnology } from "@/features/skills/get-skills";
import type { LocalTechIcon } from "@/lib/technologies/local-public-tech-icons";
import { normalizeTechnologyNameKey } from "@/lib/technologies/technology-name-key";

export type CatalogTechnology = {
  id: string;
  name: string;
  nameKey: string;
  svgUrl?: string | null;
};

export type SkillWithTech = SkillWithTechnology;

type Props = {
  catalog: CatalogTechnology[];
  /** Actuais no servidor — carrossel + estado inicial da selecção. */
  skills: SkillWithTechnology[];
  localTechIcons: LocalTechIcon[];
};

export default function SkillsEditorClient({
  catalog,
  skills,
  localTechIcons,
}: Props) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);

  const [catalogLocal, setCatalogLocal] = useState(catalog);
  const [selected, setSelected] = useState<Map<string, Level>>(() => {
    const m = new Map<string, Level>();
    for (const s of skills) m.set(s.technology.id, s.level);
    return m;
  });

  /** Seleção dentro do modal: caminhos `/images/tech/....svg`. */
  const [modalDraft, setModalDraft] = useState<Set<string>>(new Set());
  const [modalQuery, setModalQuery] = useState("");

  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function openModal() {
    const draft = new Set<string>();
    for (const [techId] of selected) {
      const tech = catalogLocal.find((t) => t.id === techId);
      if (!tech) continue;

      if (tech.svgUrl?.startsWith("/images/tech/")) {
        const byUrl = localTechIcons.find((i) => i.src === tech.svgUrl);
        if (byUrl) {
          draft.add(byUrl.src);
          continue;
        }
      }

      const byLabel = localTechIcons.find(
        (li) =>
          normalizeTechnologyNameKey(li.label) === tech.nameKey ||
          normalizeTechnologyNameKey(li.label) === normalizeTechnologyNameKey(tech.name),
      );
      if (byLabel) draft.add(byLabel.src);
    }
    setModalDraft(draft);
    setModalQuery("");
    setError(null);
    dialogRef.current?.showModal();
  }

  function closeModal() {
    dialogRef.current?.close();
  }

  function toggleLocalSrc(src: string) {
    setModalDraft((prev) => {
      const next = new Set(prev);
      if (next.has(src)) next.delete(src);
      else next.add(src);
      return next;
    });
  }

  const modalFiltered = useMemo(() => {
    const q = modalQuery.trim().toLowerCase();
    if (!q) return localTechIcons;
    return localTechIcons.filter((li) => li.label.toLowerCase().includes(q));
  }, [localTechIcons, modalQuery]);

  async function applyAndSave() {
    setPending(true);
    setError(null);
    try {
      const result = await syncSkillsAction([...modalDraft]);
      if (!result.ok) {
        setError(result.error);
        return;
      }

      setCatalogLocal(result.catalog);
      setSelected(
        new Map(
          result.skills.map((skill) => [skill.technologyId, skill.level] as const),
        ),
      );

      closeModal();
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Não foi possível guardar as habilidades.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="min-w-0 flex-1">
          <SkillsPillsClient skills={skills} />
        </div>
        <button
          type="button"
          onClick={openModal}
          disabled={pending || localTechIcons.length === 0}
          title={
            localTechIcons.length === 0
              ? "Adicione SVG em public/images/tech/"
              : "Adicionar ou editar tecnologias"
          }
          aria-label="Adicionar ou editar tecnologias"
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-300 bg-white text-violet-700 shadow-sm transition hover:bg-violet-50 hover:shadow disabled:cursor-not-allowed disabled:opacity-40 dark:border-violet-600/50 dark:bg-violet-950/40 dark:text-violet-200 dark:hover:bg-violet-900/50"
        >
          {pending ? (
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
          ) : (
            <Plus className="h-5 w-5" aria-hidden strokeWidth={2.5} />
          )}
        </button>
      </div>

      {localTechIcons.length === 0 ? (
        <p className="text-xs text-amber-700 dark:text-amber-400">
          Coloque ficheiros SVG em{" "}
          <code className="rounded bg-black/5 px-1 dark:bg-white/10">public/images/tech/</code> para
          poder escolher tecnologias.
        </p>
      ) : null}

      {error ? <p className="text-sm text-red-600 dark:text-red-400">{error}</p> : null}

      <dialog
        ref={dialogRef}
        className="max-h-[92vh] w-[min(100%-1.5rem,56rem)] max-w-none rounded-2xl border border-gray-200 bg-white p-0 text-gray-900 shadow-2xl backdrop:bg-black/55 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
        aria-labelledby="local-tech-catalog-heading"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-gray-100 bg-white/95 px-5 py-4 backdrop-blur dark:border-gray-800 dark:bg-gray-950/95">
          <h2 id="local-tech-catalog-heading" className="text-lg font-semibold">
            Tecnologias
          </h2>
          <button
            type="button"
            onClick={closeModal}
            disabled={pending}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 disabled:opacity-50 dark:text-gray-400 dark:hover:bg-gray-900"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[min(78vh,calc(100vh-8rem))] overflow-y-auto px-5 pb-5 pt-4">
          <input
            type="search"
            value={modalQuery}
            onChange={(e) => setModalQuery(e.target.value)}
            placeholder="Filtrar por nome…"
            disabled={pending}
            className="mb-4 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900"
          />

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6">
            {modalFiltered.map((item) => {
              const active = modalDraft.has(item.src);
              return (
                <button
                  key={item.src}
                  type="button"
                  onClick={() => toggleLocalSrc(item.src)}
                  disabled={pending}
                  aria-pressed={active}
                  aria-label={`${active ? "Desmarcar" : "Selecionar"} ${item.label}`}
                  className={`flex flex-col items-center gap-2 rounded-xl border-2 px-3 py-3 text-center shadow-sm outline-none ring-offset-2 transition hover:border-violet-400/70 focus-visible:ring-2 focus-visible:ring-violet-500 disabled:opacity-50 ${
                    active
                      ? "border-violet-500 bg-violet-500/[0.12] dark:border-violet-400 dark:bg-violet-500/15"
                      : "border-gray-100 bg-gray-50/80 dark:border-gray-800 dark:bg-gray-900/50"
                  }`}
                >
                  <span className="flex h-[52px] w-full items-center justify-center">
                    {/* Ícones SVG locais vindos de public/images/tech/. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.src}
                      alt=""
                      width={44}
                      height={44}
                      className="max-h-11 w-auto max-w-full object-contain dark:brightness-[1.05]"
                      loading="lazy"
                      decoding="async"
                    />
                  </span>
                  <span className="line-clamp-3 text-[11px] font-medium leading-tight">{item.label}</span>
                  <span className="min-h-[14px] text-[10px] font-semibold uppercase tracking-wide text-violet-700 dark:text-violet-300">
                    {active ? "Selecionada" : "\u00a0"}
                  </span>
                </button>
              );
            })}
          </div>

          {modalFiltered.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
              Nenhum ícone coincide com este filtro.
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap justify-end gap-2 border-t border-gray-100 bg-gray-50/90 px-5 py-4 dark:border-gray-800 dark:bg-gray-900/80">
          <button
            type="button"
            onClick={closeModal}
            disabled={pending}
            className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-100 disabled:opacity-50 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => void applyAndSave()}
            disabled={pending}
            className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2 text-sm font-semibold text-white hover:bg-violet-500 disabled:opacity-60"
          >
            {pending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
            Aplicar e guardar
          </button>
        </div>
      </dialog>
    </div>
  );
}
