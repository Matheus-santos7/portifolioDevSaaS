"use client";

import type { CertificateKind, Status } from "@prisma/client";
import { Loader2, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useRef, useState } from "react";

import type { CertificateCarouselItem } from "@/app/features/_components/certificates/certificate-carousel-types";
import { formatCertificateStatusLabel } from "@/app/features/_components/certificates/ui";
import AdminCertificatesCarousel from "@/app/features/admin/certificates/AdminCertificatesCarousel";
import type { CertificateClient } from "@/app/features/public/certificates/server/serialize";

const emptyForm = {
  name: "",
  kind: "CERTIFICATION" as CertificateKind,
  endDate: "",
  emitter: "",
  status: "COMPLETED" as Status,
  link: "",
};

type FormState = typeof emptyForm;

function isoToDateInput(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function dateInputToIsoForApi(ymd: string) {
  const [y, m, d] = ymd.split("-").map(Number);
  if (!y || !m || !d) return "";
  return new Date(y, m - 1, d, 12, 0, 0, 0).toISOString();
}

function certificateToForm(c: CertificateClient): FormState {
  return {
    name: c.name,
    kind: c.kind,
    endDate: c.endDate ? isoToDateInput(c.endDate) : "",
    emitter: c.emitter,
    status: c.status,
    link: c.link,
  };
}

function toCarouselItem(c: CertificateClient): CertificateCarouselItem {
  return {
    id: c.id,
    name: c.name,
    kind: c.kind,
    endDate: c.endDate,
    emitter: c.emitter,
    statusLabel: formatCertificateStatusLabel(c.status),
    link: c.link,
  };
}

const ADD_CERT_BUTTON_CLASS =
  "inline-flex items-center justify-center rounded-xl border border-violet-300 bg-white px-5 py-2.5 text-sm font-semibold text-violet-700 shadow-sm transition hover:bg-violet-50 hover:shadow disabled:cursor-not-allowed disabled:opacity-40 dark:border-violet-600/50 dark:bg-violet-950/40 dark:text-violet-200 dark:hover:bg-violet-900/50";

type Props = {
  initialCertificates: CertificateClient[];
  carouselCertificates: CertificateClient[];
  showTitle?: boolean;
};

export default function CertificatesEditorClient({
  initialCertificates,
  carouselCertificates,
  showTitle = true,
}: Props) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);

  const [rows, setRows] = useState(initialCertificates);
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);

  const [submitting, setSubmitting] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setRows(initialCertificates);
  }, [initialCertificates]);

  function openCreateModal() {
    setModalMode("create");
    setEditingId(null);
    setForm(emptyForm);
    setError(null);
    dialogRef.current?.showModal();
  }

  function openEditModal(c: CertificateClient) {
    setModalMode("edit");
    setEditingId(c.id);
    setForm(certificateToForm(c));
    setError(null);
    dialogRef.current?.showModal();
  }

  function closeModal() {
    dialogRef.current?.close();
    setModalMode(null);
    setEditingId(null);
    setForm(emptyForm);
    setError(null);
  }

  async function submitModal(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const emAndamento = form.status === "IN_PROGRESS";
    const endIso = form.endDate.trim()
      ? dateInputToIsoForApi(form.endDate.trim())
      : "";

    if (!emAndamento) {
      if (!endIso) {
        setError("Indique uma data de emissão válida.");
        setSubmitting(false);
        return;
      }
      if (!form.link.trim()) {
        setError("Indique o link do certificado.");
        setSubmitting(false);
        return;
      }
    }

    const body = {
      name: form.name.trim(),
      kind: form.kind,
      endDate: emAndamento ? (endIso || null) : endIso,
      emitter: form.emitter.trim(),
      status: form.status,
      link: form.link.trim(),
    };

    try {
      if (modalMode === "edit" && editingId) {
        const res = await fetch(`/api/account/certificates/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(body),
        });
        if (!res.ok) {
          const j = (await res.json().catch(() => ({}))) as { error?: string };
          setError(j.error ?? "Não foi possível guardar.");
          return;
        }
        const updated = (await res.json()) as CertificateClient;
        setRows((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
        closeModal();
        router.refresh();
        return;
      }

      if (modalMode === "create") {
        const res = await fetch("/api/account/certificates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(body),
        });
        if (!res.ok) {
          const j = (await res.json().catch(() => ({}))) as { error?: string };
          setError(j.error ?? "Não foi possível criar o certificado.");
          return;
        }
        const created = (await res.json()) as CertificateClient;
        setRows((prev) => [created, ...prev]);
        closeModal();
        router.refresh();
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function deleteCertificateFromModal() {
    if (!editingId || modalMode !== "edit") return;
    if (!window.confirm("Eliminar este certificado? Esta ação não pode ser anulada.")) return;
    setPending(true);
    setError(null);
    try {
      const res = await fetch(`/api/account/certificates/${editingId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        setError("Não foi possível eliminar.");
        return;
      }
      setRows((prev) => prev.filter((x) => x.id !== editingId));
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

  const emAndamento = form.status === "IN_PROGRESS";

  const carouselItems = carouselCertificates.map(toCarouselItem);

  return (
    <div className="mt-4 space-y-4">
      <AdminCertificatesCarousel
        certificates={carouselItems}
        sectionTitle={showTitle ? "Meus Certificados" : undefined}
        onCertificateClick={(item) => {
          const full = rows.find((r) => r.id === item.id);
          if (full) openEditModal(full);
        }}
        belowIndicators={
          <button
            type="button"
            onClick={openCreateModal}
            disabled={submitting || pending}
            aria-label="Adicionar novo certificado"
            className={ADD_CERT_BUTTON_CLASS}
          >
            + Adicionar Novo Certificado
          </button>
        }
      />

      <dialog
        ref={dialogRef}
        className="max-h-[92vh] w-[min(100%-1.5rem,32rem)] max-w-none rounded-2xl border border-gray-200 bg-white p-0 text-gray-900 shadow-2xl backdrop:bg-black/55 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
        aria-labelledby="certificate-modal-title"
        onClose={() => {
          setModalMode(null);
          setEditingId(null);
          setForm(emptyForm);
          setError(null);
        }}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-800">
          <h2 id="certificate-modal-title" className="text-lg font-semibold">
            {modalMode === "edit" ? "Editar certificado" : "Novo certificado"}
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
              <label className={labelClass} htmlFor="cert-modal-name">
                Nome
              </label>
              <input
                id="cert-modal-name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className={inputClass}
                required
                maxLength={200}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="cert-modal-kind">
                Tipo
              </label>
              <select
                id="cert-modal-kind"
                value={form.kind}
                onChange={(e) =>
                  setForm((f) => ({ ...f, kind: e.target.value as CertificateKind }))
                }
                className={inputClass}
              >
                <option value="GRADUATION">Graduação</option>
                <option value="POST_GRADUATION">Pós-graduação</option>
                <option value="EXTENSION">Extensão</option>
                <option value="COURSE">Curso</option>
                <option value="CERTIFICATION">Certificação</option>
                <option value="WORKSHOP">Workshop</option>
                <option value="OTHER">Outro</option>
              </select>
            </div>
            <div>
              <label className={labelClass} htmlFor="cert-modal-date">
                Data de emissão{" "}
                {emAndamento ? (
                  <span className="font-normal normal-case text-gray-400">(opcional)</span>
                ) : null}
              </label>
              <input
                id="cert-modal-date"
                type="date"
                value={form.endDate}
                onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
                className={inputClass}
                required={!emAndamento}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="cert-modal-emitter">
                Emissor
              </label>
              <input
                id="cert-modal-emitter"
                value={form.emitter}
                onChange={(e) => setForm((f) => ({ ...f, emitter: e.target.value }))}
                className={inputClass}
                required
                maxLength={200}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="cert-modal-status">
                Estado
              </label>
              <select
                id="cert-modal-status"
                value={form.status}
                onChange={(e) =>
                  setForm((f) => ({ ...f, status: e.target.value as Status }))
                }
                className={inputClass}
              >
                <option value="COMPLETED">Completo</option>
                <option value="IN_PROGRESS">Em andamento</option>
                <option value="PENDING">Pendente</option>
              </select>
            </div>
            <div>
              <label className={labelClass} htmlFor="cert-modal-link">
                Link do certificado{" "}
                {emAndamento ? (
                  <span className="font-normal normal-case text-gray-400">(opcional)</span>
                ) : null}
              </label>
              <input
                id="cert-modal-link"
                type="url"
                value={form.link}
                onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))}
                className={inputClass}
                required={!emAndamento}
                placeholder={emAndamento ? "Pode adicionar quando concluir" : undefined}
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4 dark:border-gray-800">
            <div>
              {modalMode === "edit" ? (
                <button
                  type="button"
                  onClick={() => void deleteCertificateFromModal()}
                  disabled={submitting || pending}
                  className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/40"
                >
                  <Trash2 className="h-4 w-4" aria-hidden />
                  Eliminar certificado
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
