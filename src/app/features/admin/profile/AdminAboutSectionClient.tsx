"use client";

import { Code, GraduationCap, Pencil, Save, Shield, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { AvatarUploadCircle } from "@/app/features/_components/ui/AvatarUploadCircle";
import ScrollRevealWrapper from "@/app/features/_components/ui/ScrollRevealWrapper";
import { uploadProfileAvatarFile } from "@/app/features/admin/profile/upload-profile-avatar";
import type { AboutSectionViewModel } from "@/app/features/public/profile/server/types";
import { isSafeImageSrc } from "@/app/features/public/profile/server/urls";
import { formationLine } from "@/app/lib/profile/about-formatting";
import { nextImageUnoptimized } from "@/app/lib/storage/blob-url";

export default function AdminAboutSectionClient({
  name,
  bio,
  displayAvatarSrc: displayAvatarSrcProp,
  degreeKind: degreeKindProp,
  degreeHighlight: degreeHighlightProp,
  currentSector: currentSectorProp,
  targetSector: targetSectorProp,
  educationStatus,
  educationCourse,
}: AboutSectionViewModel) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState(name);
  const [bioInput, setBioInput] = useState(bio);
  const [degreeKindInput, setDegreeKindInput] = useState(degreeKindProp);
  const [degreeHighlightInput, setDegreeHighlightInput] = useState(degreeHighlightProp);
  const [currentSectorInput, setCurrentSectorInput] = useState(currentSectorProp);
  const [targetSectorInput, setTargetSectorInput] = useState(targetSectorProp);

  const [viewName, setViewName] = useState(name);
  const [currentBio, setCurrentBio] = useState(bio);
  const [currentDisplayAvatar, setCurrentDisplayAvatar] = useState(displayAvatarSrcProp ?? "");
  const [viewDegreeKind, setViewDegreeKind] = useState(degreeKindProp);
  const [viewDegreeHighlight, setViewDegreeHighlight] = useState(degreeHighlightProp);
  const [viewCurrentSector, setViewCurrentSector] = useState(currentSectorProp);
  const [viewTargetSector, setViewTargetSector] = useState(targetSectorProp);

  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    setViewName(name);
    setCurrentBio(bio);
    setCurrentDisplayAvatar(displayAvatarSrcProp ?? "");
    setViewDegreeKind(degreeKindProp);
    setViewDegreeHighlight(degreeHighlightProp);
    setViewCurrentSector(currentSectorProp);
    setViewTargetSector(targetSectorProp);

    if (!isEditing) {
      setNameInput(name);
      setBioInput(bio);
      setDegreeKindInput(degreeKindProp);
      setDegreeHighlightInput(degreeHighlightProp);
      setCurrentSectorInput(currentSectorProp);
      setTargetSectorInput(targetSectorProp);
    }
  }, [
    name,
    bio,
    displayAvatarSrcProp,
    degreeKindProp,
    degreeHighlightProp,
    currentSectorProp,
    targetSectorProp,
    isEditing,
  ]);

  const uploadAvatarFile = useCallback(
    async (file: File) => {
      if (isUploadingAvatar) return;
      setIsUploadingAvatar(true);
      setSaveMessage(null);
      try {
        const result = await uploadProfileAvatarFile(file);
        if (!result.ok) {
          setSaveMessage(result.error);
          return;
        }
        setCurrentDisplayAvatar(result.avatarUrl);
        setSaveMessage("Foto guardada.");
        router.refresh();
      } finally {
        setIsUploadingAvatar(false);
      }
    },
    [isUploadingAvatar, router],
  );

  async function handleSaveProfile() {
    if (isSaving) return;
    const trimmedName = nameInput.trim();
    if (!trimmedName) {
      setSaveMessage("Informe um nome.");
      return;
    }

    setIsSaving(true);
    setSaveMessage(null);

    const payload: Record<string, unknown> = {
      name: trimmedName,
      bio: bioInput.trim(),
      degreeKind: degreeKindInput,
      degreeHighlight: degreeHighlightInput.trim(),
    };
    const currentSector = currentSectorInput.trim();
    const targetSector = targetSectorInput.trim();
    if (currentSector) payload.currentSector = currentSector;
    if (targetSector) payload.targetSector = targetSector;

    try {
      const response = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const payloadJson = (await response.json().catch(() => ({}))) as {
        name?: string;
        bio?: string;
        degreeKind?: AboutSectionViewModel["degreeKind"];
        degreeHighlight?: string;
        currentSector?: string;
        targetSector?: string;
        error?: string;
      };

      if (!response.ok) {
        setSaveMessage(payloadJson.error ?? "Nao foi possivel salvar.");
        return;
      }

      if (payloadJson.name) setViewName(payloadJson.name);
      setCurrentBio(payloadJson.bio ?? bioInput.trim());
      setViewDegreeKind(payloadJson.degreeKind ?? degreeKindInput);
      setViewDegreeHighlight(payloadJson.degreeHighlight ?? degreeHighlightInput.trim());
      if (payloadJson.currentSector) setViewCurrentSector(payloadJson.currentSector);
      if (payloadJson.targetSector) setViewTargetSector(payloadJson.targetSector);

      setIsEditing(false);
      setSaveMessage("Perfil atualizado.");
      window.location.reload();
    } catch {
      setSaveMessage("Erro ao salvar.");
    } finally {
      setIsSaving(false);
    }
  }

  const gridFormation =
    formationLine(viewDegreeKind, viewDegreeHighlight, educationStatus, educationCourse) || "—";

  return (
    <ScrollRevealWrapper className="profile-section" options={{ origin: "bottom", delay: 500 }}>
      <div className="profile-section mb-4 mt-16 rounded-xl bg-white p-6 shadow-md dark:bg-gray-800">
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
          {isEditing ? (
            <AvatarUploadCircle
              sizePx={128}
              displaySrc={currentDisplayAvatar}
              alt={`Foto de perfil de ${viewName}`}
              interactive
              isUploading={isUploadingAvatar}
              onPickFile={uploadAvatarFile}
            />
          ) : (
            <div className="mx-auto h-32 w-32 min-h-[128px] min-w-[128px] shrink-0 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-600 md:mx-0">
              {currentDisplayAvatar && isSafeImageSrc(currentDisplayAvatar) ? (
                <Image
                  src={currentDisplayAvatar}
                  alt={`Foto de perfil de ${viewName}`}
                  width={128}
                  height={128}
                  className="h-full w-full object-cover"
                  unoptimized={nextImageUnoptimized(currentDisplayAvatar)}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center px-2 text-center text-sm text-gray-400 dark:text-gray-300">
                  Sem foto
                </div>
              )}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="mb-2 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  if (isEditing) {
                    setNameInput(viewName);
                    setBioInput(currentBio);
                    setDegreeKindInput(viewDegreeKind);
                    setDegreeHighlightInput(viewDegreeHighlight);
                    setCurrentSectorInput(viewCurrentSector);
                    setTargetSectorInput(viewTargetSector);
                    setCurrentDisplayAvatar(displayAvatarSrcProp ?? "");
                    setSaveMessage(null);
                  }
                  setIsEditing((prev) => !prev);
                }}
                className="shrink-0 rounded-md border border-gray-200/80 bg-white/90 p-2 text-gray-700 shadow-sm hover:bg-white dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                aria-label={isEditing ? "Fechar edição" : "Editar perfil"}
                title={isEditing ? "Fechar edição" : "Editar perfil"}
              >
                {isEditing ? <X className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
              </button>
            </div>

            {isEditing ? (
              <div className="space-y-3 pt-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
                    Nome
                  </label>
                  <input
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="Seu nome público"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
                    Bio
                  </label>
                  <textarea
                    value={bioInput}
                    onChange={(e) => setBioInput(e.target.value)}
                    rows={4}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
                      Formação
                    </label>
                    <select
                      value={degreeKindInput}
                      onChange={(e) =>
                        setDegreeKindInput(e.target.value as AboutSectionViewModel["degreeKind"])
                      }
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                    >
                      <option value="GRADUATION">Graduado</option>
                      <option value="POST_GRADUATION">Pós-graduado</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
                      Curso / destaque <span className="font-normal text-gray-400">(opcional)</span>
                    </label>
                    <input
                      value={degreeHighlightInput}
                      onChange={(e) => setDegreeHighlightInput(e.target.value)}
                      placeholder="Ex.: Desenvolvimento Web Full Stack"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
                      Cargo atual <span className="font-normal text-gray-400">(opcional)</span>
                    </label>
                    <input
                      value={currentSectorInput}
                      onChange={(e) => setCurrentSectorInput(e.target.value)}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
                      Cargo alvo <span className="font-normal text-gray-400">(opcional)</span>
                    </label>
                    <input
                      value={targetSectorInput}
                      onChange={(e) => setTargetSectorInput(e.target.value)}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="inline-flex items-center gap-1 rounded-md bg-violet-600 px-3 py-2 text-sm font-medium text-white hover:bg-violet-500 disabled:opacity-60"
                >
                  <Save className="h-4 w-4" />
                  {isSaving ? "Salvando..." : "Salvar"}
                </button>
              </div>
            ) : (
              <>
                <div className="flex max-w-md flex-col items-center gap-2 text-center text-gray-700 dark:text-gray-300 sm:flex-row sm:items-start sm:gap-3 sm:text-left">
                   <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{viewName || "—"}</h1>
                </div>
                <p className="text-justify text-gray-600 dark:text-gray-300">{currentBio}</p>
              </>
            )}

            {saveMessage ? (
              <p className="mt-2 text-xs text-gray-600 dark:text-gray-300">{saveMessage}</p>
            ) : null}
          </div>
        </div>

        <div className="mt-6 border-t border-gray-200/80 pt-6 dark:border-gray-700/80">
          <div className="flex flex-col items-center gap-6 md:flex-row md:flex-wrap md:justify-center md:gap-x-10 md:gap-y-6 lg:gap-x-14">
            <div className="flex max-w-md flex-col items-center gap-2 text-center text-gray-700 dark:text-gray-300 sm:flex-row sm:items-start sm:gap-3 sm:text-left">
              <GraduationCap className="h-5 w-5 shrink-0 text-indigo-600 dark:text-indigo-400" />
              <span className="leading-snug">{gridFormation}</span>
            </div>
            <div className="flex max-w-md flex-col items-center gap-2 text-center text-gray-700 dark:text-gray-300 sm:flex-row sm:items-start sm:gap-3 sm:text-left">
              <Shield className="h-5 w-5 shrink-0 text-indigo-600 dark:text-indigo-400" />
              <span className="leading-snug">Cargo Atual: {viewCurrentSector || "—"}</span>
            </div>
            <div className="flex max-w-md flex-col items-center gap-2 text-center text-gray-700 dark:text-gray-300 sm:flex-row sm:items-start sm:gap-3 sm:text-left">
              <Code className="h-5 w-5 shrink-0 text-indigo-600 dark:text-indigo-400" />
              <span className="leading-snug">Cargo Alvo: {viewTargetSector || "—"}</span>
            </div>
          </div>
        </div>
      </div>
    </ScrollRevealWrapper>
  );
}
