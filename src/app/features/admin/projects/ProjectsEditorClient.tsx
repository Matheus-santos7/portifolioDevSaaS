"use client";

import { Loader2, Trash2, Upload, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useRef, useState } from "react";

import AdminProjectsCarousel from "@/app/features/admin/projects/AdminProjectsCarousel";
import type { ProjectPublic } from "@/app/features/public/projects/server/get-project";
import { resolveProjectCoverSrc } from "@/app/features/public/projects/server/resolve-project-cover-src";
import { hasManagedProjectCover, nextImageUnoptimized } from "@/app/lib/storage/blob-url";

const emptyForm = {
  name: "",
  description: "",
  backgroundCover: "",
  repositorio: "",
  linkView: "",
};

type FormState = typeof emptyForm;

function projectToForm(p: ProjectPublic): FormState {
  return {
    name: p.name,
    description: p.description,
    backgroundCover: hasManagedProjectCover(p)
      ? ""
      : p.backgroundCover === "/images/projects/default-project.png"
        ? ""
        : p.backgroundCover,
    repositorio: p.repositorio,
    linkView: p.linkView,
  };
}

const ADD_PROJECT_BUTTON_CLASS =
  "inline-flex items-center justify-center rounded-xl border border-violet-300 bg-white px-5 py-2.5 text-sm font-semibold text-violet-700 shadow-sm transition hover:bg-violet-50 hover:shadow disabled:cursor-not-allowed disabled:opacity-40 dark:border-violet-600/50 dark:bg-violet-950/40 dark:text-violet-200 dark:hover:bg-violet-900/50";

type Props = {
  initialProjects: ProjectPublic[];
  /** Lista já limitada para o carrossel (URLs da capa já resolvidas para `<Image>`). */
  carouselProjects: Array<
    ProjectPublic & { backgroundCover: string }
  >;
  showTitle?: boolean;
};

const COVER_MAX_MB = 1;
const COVER_ACCEPT = "image/jpeg,image/png,image/webp,image/gif";

export default function ProjectsEditorClient({
  initialProjects,
  carouselProjects,
  showTitle = true,
}: Props) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [projects, setProjects] = useState(initialProjects);
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);
  const [pendingRemoveCover, setPendingRemoveCover] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setProjects(initialProjects);
  }, [initialProjects]);

  useEffect(() => {
    if (!coverFile) {
      setCoverPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(coverFile);
    setCoverPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [coverFile]);

  function resetCoverState() {
    setCoverFile(null);
    setCoverPreviewUrl(null);
    setPendingRemoveCover(false);
    setDragActive(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function openCreateModal() {
    setModalMode("create");
    setEditingId(null);
    setForm(emptyForm);
    resetCoverState();
    setError(null);
    dialogRef.current?.showModal();
  }

  function openEditModal(p: ProjectPublic) {
    setModalMode("edit");
    setEditingId(p.id);
    setForm(projectToForm(p));
    resetCoverState();
    setError(null);
    dialogRef.current?.showModal();
  }

  function closeModal() {
    dialogRef.current?.close();
    setModalMode(null);
    setEditingId(null);
    setForm(emptyForm);
    resetCoverState();
    setError(null);
  }

  /** Preview mostrado no modal (novo ficheiro, servidor ou placeholder). */
  function modalCoverDisplaySrc(): string | null {
    if (coverPreviewUrl) return coverPreviewUrl;
    if (modalMode === "create") return null;

    if (modalMode === "edit" && editingId) {
      const row = projects.find((x) => x.id === editingId);
      if (!row) return null;

      const managedCover = hasManagedProjectCover(row) && !pendingRemoveCover;
      const src = resolveProjectCoverSrc({
        backgroundCover: managedCover
          ? row.backgroundCover
          : form.backgroundCover.trim() || "/images/projects/default-project.png",
      });
      if (src === "/images/projects/default-project.png") return null;
      return src;
    }
    return null;
  }

  function onDropFiles(files: FileList | null) {
    const f = files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setError("Use um ficheiro de imagem (JPG, PNG, WebP ou GIF).");
      return;
    }
    if (f.size > COVER_MAX_MB * 1024 * 1024) {
      setError(`Imagem inválida ou maior que ${COVER_MAX_MB} MB.`);
      return;
    }
    setError(null);
    setCoverFile(f);
    setPendingRemoveCover(false);
  }

  async function applyCoverOperations(projectId: string): Promise<ProjectPublic | null> {
    if (pendingRemoveCover) {
      const del = await fetch(`/api/account/projects/${projectId}/cover`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!del.ok) {
        const j = (await del.json().catch(() => ({}))) as { error?: string };
        setError(j.error ?? "Não foi possível remover a imagem.");
        return null;
      }
      return (await del.json()) as ProjectPublic;
    }

    if (coverFile) {
      const fd = new FormData();
      fd.append("file", coverFile);
      const up = await fetch(`/api/account/projects/${projectId}/cover`, {
        method: "POST",
        body: fd,
        credentials: "include",
      });
      if (!up.ok) {
        const j = (await up.json().catch(() => ({}))) as { error?: string };
        setError(j.error ?? "Não foi possível enviar a imagem.");
        return null;
      }
      return (await up.json()) as ProjectPublic;
    }

    return null;
  }

  async function submitModal(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const editingRow =
      modalMode === "edit" && editingId
        ? projects.find((x) => x.id === editingId)
        : undefined;

    const putPayload: {
      name: string;
      description: string;
      repositorio: string;
      linkView: string;
      backgroundCover?: string;
    } = {
      name: form.name.trim(),
      description: form.description.trim(),
      repositorio: form.repositorio.trim(),
      linkView: form.linkView.trim(),
    };

    const mayTouchExternalCoverUrl =
      !editingRow ||
      !hasManagedProjectCover(editingRow) ||
      pendingRemoveCover ||
      Boolean(coverFile);

    if (mayTouchExternalCoverUrl) {
      putPayload.backgroundCover =
        form.backgroundCover.trim() || "/images/projects/default-project.png";
    }

    try {
      if (modalMode === "edit" && editingId) {
        const res = await fetch(`/api/account/projects/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(putPayload),
        });
        if (!res.ok) {
          const j = (await res.json().catch(() => ({}))) as { error?: string };
          setError(j.error ?? "Não foi possível guardar.");
          return;
        }
        let updated = (await res.json()) as ProjectPublic;

        if (pendingRemoveCover || coverFile) {
          const afterCover = await applyCoverOperations(editingId);
          if (afterCover === null && (pendingRemoveCover || coverFile)) {
            return;
          }
          if (afterCover) updated = afterCover;
        }

        setProjects((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
        closeModal();
        router.refresh();
        return;
      }

      if (modalMode === "create") {
        const res = await fetch("/api/account/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            name: form.name.trim(),
            description: form.description.trim(),
            repositorio: form.repositorio.trim(),
            linkView: form.linkView.trim(),
            backgroundCover:
              form.backgroundCover.trim() || "/images/projects/default-project.png",
          }),
        });
        if (!res.ok) {
          const j = (await res.json().catch(() => ({}))) as { error?: string };
          setError(j.error ?? "Não foi possível criar o projeto.");
          return;
        }
        let created = (await res.json()) as ProjectPublic;

        if (coverFile || pendingRemoveCover) {
          const afterCover = await applyCoverOperations(created.id);
          if (afterCover === null && (coverFile || pendingRemoveCover)) return;
          if (afterCover) created = afterCover;
        }

        setProjects((prev) => [created, ...prev]);
        closeModal();
        router.refresh();
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function deleteProjectFromModal() {
    if (!editingId || modalMode !== "edit") return;
    if (!window.confirm("Eliminar este projeto? Esta ação não pode ser anulada.")) return;
    setPending(true);
    setError(null);
    try {
      const res = await fetch(`/api/account/projects/${editingId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        setError("Não foi possível eliminar.");
        return;
      }
      setProjects((prev) => prev.filter((x) => x.id !== editingId));
      closeModal();
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100";
  const labelClass =
    "mb-1 block text-[11px] font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400";

  const coverDisplay = modalCoverDisplaySrc();
  const editingRow =
    modalMode === "edit" && editingId
      ? projects.find((x) => x.id === editingId)
      : undefined;
  const showExternalUrlField =
    !editingRow || !hasManagedProjectCover(editingRow) || pendingRemoveCover;

  return (
    <div className="mt-4 space-y-4">
      <AdminProjectsCarousel
        projects={carouselProjects}
        sectionTitle={showTitle ? "Meus Projetos" : undefined}
        onProjectClick={(item) => {
          const full = projects.find((p) => p.id === item.id);
          if (full) openEditModal(full);
        }}
        belowIndicators={
          <button
            type="button"
            onClick={openCreateModal}
            disabled={submitting || pending}
            aria-label="Adicionar novo projeto"
            className={ADD_PROJECT_BUTTON_CLASS}
          >
            + Adicionar Novo Projeto
          </button>
        }
      />

      <dialog
        ref={dialogRef}
        className="max-h-[92vh] w-[min(100%-1.5rem,32rem)] max-w-none rounded-2xl border border-gray-200 bg-white p-0 text-gray-900 shadow-2xl backdrop:bg-black/55 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
        aria-labelledby="project-modal-title"
        onClose={() => {
          setModalMode(null);
          setEditingId(null);
          setForm(emptyForm);
          resetCoverState();
          setError(null);
        }}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-800">
          <h2 id="project-modal-title" className="text-lg font-semibold">
            {modalMode === "edit" ? "Editar projeto" : "Novo projeto"}
          </h2>
          <button
            type="button"
            onClick={closeModal}
            disabled={submitting}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 disabled:opacity-50 dark:hover:bg-gray-900"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          onSubmit={submitModal}
          className="max-h-[min(70vh,calc(100vh-10rem))] overflow-y-auto px-5 py-4"
        >
          {error ? (
            <p className="mb-3 text-sm text-red-600 dark:text-red-400">{error}</p>
          ) : null}

          <div className="space-y-3">
            <div>
              <span className={labelClass}>Capa do projeto</span>
              <input
                ref={fileInputRef}
                type="file"
                accept={COVER_ACCEPT}
                className="sr-only"
                tabIndex={-1}
                onChange={(ev) => onDropFiles(ev.target.files)}
              />
              <div
                role="presentation"
                onDragEnter={(e) => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                    setDragActive(false);
                  }
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragActive(false);
                  onDropFiles(e.dataTransfer.files);
                }}
                className={`relative overflow-hidden rounded-xl border-2 border-dashed transition-colors ${
                  dragActive
                    ? "border-indigo-500 bg-indigo-50/80 dark:bg-indigo-950/40"
                    : "border-gray-200 bg-gray-50 dark:border-gray-600 dark:bg-gray-900/50"
                }`}
              >
                <div className="relative aspect-[16/10] w-full">
                  {coverDisplay ? (
                    <Image
                      src={coverDisplay}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="(max-width: 32rem) 100vw, 32rem"
                      unoptimized={nextImageUnoptimized(coverDisplay)}
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 px-4 text-center text-sm text-gray-500 dark:text-gray-400">
                      <Upload className="h-8 w-8 opacity-60" aria-hidden />
                      <p>Arraste uma imagem ou clique em «Escolher ficheiro»</p>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 px-3 py-2 dark:border-gray-800">
                  <button
                    type="button"
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Escolher ficheiro
                  </button>
                  {coverDisplay || coverFile ? (
                    <button
                      type="button"
                      className="text-sm text-red-600 hover:text-red-500 dark:text-red-400"
                      onClick={() => {
                        setCoverFile(null);
                        if (fileInputRef.current) fileInputRef.current.value = "";
                        if (editingRow && hasManagedProjectCover(editingRow)) {
                          setPendingRemoveCover(true);
                        }
                        setForm((f) => ({ ...f, backgroundCover: "" }));
                      }}
                    >
                      Remover imagem
                    </button>
                  ) : null}
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                JPG, PNG, WebP ou GIF — até {COVER_MAX_MB} MB.
              </p>
            </div>

            {showExternalUrlField ? (
              <div>
                <label className={labelClass} htmlFor="proj-modal-cover-url">
                  URL da capa <span className="font-normal normal-case text-gray-400">(opcional)</span>
                </label>
                <input
                  id="proj-modal-cover-url"
                  type="url"
                  value={form.backgroundCover}
                  onChange={(e) => setForm((f) => ({ ...f, backgroundCover: e.target.value }))}
                  className={inputClass}
                  placeholder="https://… (se não usar arrastar e largar)"
                />
              </div>
            ) : null}

            <div>
              <label className={labelClass} htmlFor="proj-modal-name">
                Nome
              </label>
              <input
                id="proj-modal-name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className={inputClass}
                required
                maxLength={120}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="proj-modal-desc">
                Descrição
              </label>
              <textarea
                id="proj-modal-desc"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className={inputClass}
                rows={3}
                required
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="proj-modal-repo">
                Repositório
              </label>
              <input
                id="proj-modal-repo"
                type="url"
                value={form.repositorio}
                onChange={(e) => setForm((f) => ({ ...f, repositorio: e.target.value }))}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="proj-modal-view">
                Demo / site
              </label>
              <input
                id="proj-modal-view"
                type="url"
                value={form.linkView}
                onChange={(e) => setForm((f) => ({ ...f, linkView: e.target.value }))}
                className={inputClass}
                required
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4 dark:border-gray-800">
            <div>
              {modalMode === "edit" ? (
                <button
                  type="button"
                  onClick={() => void deleteProjectFromModal()}
                  disabled={submitting || pending}
                  className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/40"
                >
                  <Trash2 className="h-4 w-4" aria-hidden />
                  Eliminar projeto
                </button>
              ) : (
                <span />
              )}
            </div>
            <div className="flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={closeModal}
                disabled={submitting}
                className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-900"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={submitting || pending}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
                {modalMode === "edit" ? "Guardar" : "Adicionar"}
              </button>
            </div>
          </div>
        </form>
      </dialog>
    </div>
  );
}
