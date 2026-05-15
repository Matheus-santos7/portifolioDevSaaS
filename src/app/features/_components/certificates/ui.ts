import type { CertificateKind, Status } from "@prisma/client";

export function formatCertificateStatusLabel(status: Status): string {
  switch (status) {
    case "COMPLETED":
      return "Completo";
    case "IN_PROGRESS":
      return "Em andamento";
    case "PENDING":
      return "Pendente";
    default:
      return status;
  }
}

export function formatCertificateKindLabel(kind: CertificateKind): string {
  switch (kind) {
    case "GRADUATION":
      return "Graduação";
    case "POST_GRADUATION":
      return "Pós-graduação";
    case "EXTENSION":
      return "Extensão";
    case "COURSE":
      return "Curso";
    case "CERTIFICATION":
      return "Certificação";
    case "WORKSHOP":
      return "Workshop";
    case "OTHER":
      return "Outro";
    default:
      return kind;
  }
}

/**
 * Tag no cartão — cada tipo com matiz bem diferente (claro + anel; modo escuro com fundo semitransparente).
 */
export function certificateKindBadgeClass(kind: CertificateKind): string {
  switch (kind) {
    case "GRADUATION":
      return "bg-cyan-50/90 text-cyan-900 ring-1 ring-cyan-300/35 dark:bg-cyan-950/30 dark:text-cyan-100 dark:ring-cyan-500/25";
    case "POST_GRADUATION":
      return "bg-blue-50/90 text-blue-900 ring-1 ring-blue-300/35 dark:bg-blue-950/30 dark:text-blue-100 dark:ring-blue-500/25";
    case "EXTENSION":
      return "bg-emerald-50/90 text-emerald-900 ring-1 ring-emerald-300/35 dark:bg-emerald-950/30 dark:text-emerald-100 dark:ring-emerald-500/25";
    case "COURSE":
      return "bg-violet-50/90 text-violet-900 ring-1 ring-violet-300/35 dark:bg-violet-950/30 dark:text-violet-100 dark:ring-violet-500/25";
    case "CERTIFICATION":
      return "bg-amber-50/90 text-amber-900 ring-1 ring-amber-300/40 dark:bg-amber-950/30 dark:text-amber-100 dark:ring-amber-500/25";
    case "WORKSHOP":
      return "bg-rose-50/90 text-rose-900 ring-1 ring-rose-300/35 dark:bg-rose-950/30 dark:text-rose-100 dark:ring-rose-500/25";
    case "OTHER":
      return "bg-slate-100/80 text-slate-800 ring-1 ring-slate-300/35 dark:bg-slate-800/50 dark:text-slate-100 dark:ring-slate-500/25";
  }
}

/** Ícone «prémio» alinhado à cor do tipo (canto do cartão). */
export function certificateKindIconClass(kind: CertificateKind): string {
  switch (kind) {
    case "GRADUATION":
      return "text-cyan-600 dark:text-cyan-400";
    case "POST_GRADUATION":
      return "text-blue-600 dark:text-blue-400";
    case "EXTENSION":
      return "text-emerald-600 dark:text-emerald-400";
    case "COURSE":
      return "text-violet-600 dark:text-violet-400";
    case "CERTIFICATION":
      return "text-amber-600 dark:text-amber-400";
    case "WORKSHOP":
      return "text-rose-600 dark:text-rose-400";
    case "OTHER":
      return "text-slate-500 dark:text-slate-400";
  }
}

/**
 * Fundo do cartão inteiro por tipo — tom suave + anel, coerente com a tag.
 */
export function certificateKindCardSurfaceClass(kind: CertificateKind): string {
  switch (kind) {
    case "GRADUATION":
      return "bg-gradient-to-br from-cyan-50/25 via-white to-white/95 ring-1 ring-cyan-200/20 dark:from-gray-950/80 dark:via-cyan-950/12 dark:to-cyan-950/18 dark:ring-cyan-500/18";
    case "POST_GRADUATION":
      return "bg-gradient-to-br from-blue-50/25 via-white to-white/95 ring-1 ring-blue-200/20 dark:from-gray-950/80 dark:via-blue-950/12 dark:to-blue-950/18 dark:ring-blue-500/18";
    case "EXTENSION":
      return "bg-gradient-to-br from-emerald-50/25 via-white to-white/95 ring-1 ring-emerald-200/20 dark:from-gray-950/80 dark:via-emerald-950/12 dark:to-emerald-950/18 dark:ring-emerald-500/18";
    case "COURSE":
      return "bg-gradient-to-br from-violet-50/25 via-white to-white/95 ring-1 ring-violet-200/20 dark:from-gray-950/80 dark:via-violet-950/12 dark:to-violet-950/18 dark:ring-violet-500/18";
    case "CERTIFICATION":
      return "bg-gradient-to-br from-amber-50/30 via-white to-white/95 ring-1 ring-amber-200/22 dark:from-gray-950/80 dark:via-amber-950/12 dark:to-amber-950/18 dark:ring-amber-500/18";
    case "WORKSHOP":
      return "bg-gradient-to-br from-rose-50/25 via-white to-white/95 ring-1 ring-rose-200/20 dark:from-gray-950/80 dark:via-rose-950/12 dark:to-rose-950/18 dark:ring-rose-500/18";
    case "OTHER":
      return "bg-gradient-to-br from-slate-50/20 via-white to-white/95 ring-1 ring-slate-200/20 dark:from-gray-950/80 dark:via-slate-900/20 dark:to-slate-900/28 dark:ring-slate-500/18";
  }
}

/** Linha de rodapé e separador sob o título alinhados à cor do tipo. */
export function certificateKindMutedBorderClass(kind: CertificateKind): string {
  switch (kind) {
    case "GRADUATION":
      return "border-cyan-200/40 dark:border-cyan-800/35";
    case "POST_GRADUATION":
      return "border-blue-200/40 dark:border-blue-800/35";
    case "EXTENSION":
      return "border-emerald-200/40 dark:border-emerald-800/35";
    case "COURSE":
      return "border-violet-200/40 dark:border-violet-800/35";
    case "CERTIFICATION":
      return "border-amber-200/45 dark:border-amber-800/35";
    case "WORKSHOP":
      return "border-rose-200/40 dark:border-rose-800/35";
    case "OTHER":
      return "border-slate-200/40 dark:border-slate-600/35";
  }
}

/** Ordem fixa da paleta (reutilizada por projetos via hash do id). */
const ACCENT_KIND_ORDER = [
  "GRADUATION",
  "POST_GRADUATION",
  "EXTENSION",
  "COURSE",
  "CERTIFICATION",
  "WORKSHOP",
  "OTHER",
] as const satisfies readonly CertificateKind[];

/** Escolhe um tom da paleta de certificados de forma estável a partir de um id (ex.: `Project.id`). */
function stableAccentKindFromId(id: string): CertificateKind {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ACCENT_KIND_ORDER[Math.abs(h) % ACCENT_KIND_ORDER.length]!;
}

export function cardSurfaceClassForStableId(id: string): string {
  return certificateKindCardSurfaceClass(stableAccentKindFromId(id));
}

export function cardMutedBorderClassForStableId(id: string): string {
  return certificateKindMutedBorderClass(stableAccentKindFromId(id));
}

export function cardIconAccentClassForStableId(id: string): string {
  return certificateKindIconClass(stableAccentKindFromId(id));
}

/** Links / CTAs com hover coerente com o tom do cartão. */
export function cardInteractiveAccentClassForStableId(id: string): string {
  const k = stableAccentKindFromId(id);
  switch (k) {
    case "GRADUATION":
      return "text-cyan-700 hover:text-cyan-900 dark:text-cyan-400 dark:hover:text-cyan-300";
    case "POST_GRADUATION":
      return "text-blue-700 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300";
    case "EXTENSION":
      return "text-emerald-700 hover:text-emerald-900 dark:text-emerald-400 dark:hover:text-emerald-300";
    case "COURSE":
      return "text-violet-700 hover:text-violet-900 dark:text-violet-400 dark:hover:text-violet-300";
    case "CERTIFICATION":
      return "text-amber-700 hover:text-amber-900 dark:text-amber-400 dark:hover:text-amber-300";
    case "WORKSHOP":
      return "text-rose-700 hover:text-rose-900 dark:text-rose-400 dark:hover:text-rose-300";
    case "OTHER":
      return "text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100";
  }
}
