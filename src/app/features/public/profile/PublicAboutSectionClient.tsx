"use client";

import { Code, Globe, GraduationCap, Shield } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import ScrollRevealWrapper from "@/app/features/_components/ui/ScrollRevealWrapper";
import {
  formationLine,
  isSafeImageSrc,
} from "@/app/features/public/profile/server/about-section-utils";
import type { AboutSectionViewModel } from "@/app/features/public/profile/server/profileTypes";
import { nextImageUnoptimized } from "@/app/lib/storage/blob-url";

export default function PublicAboutSectionClient({
  name,
  slug,
  bio,
  displayAvatarSrc,
  degreeKind,
  degreeHighlight,
  currentSector,
  targetSector,
  educationStatus,
  educationCourse,
}: AboutSectionViewModel) {
  const gridFormation =
    formationLine(degreeKind, degreeHighlight, educationStatus, educationCourse) || "—";

  return (
    <ScrollRevealWrapper className="profile-section" options={{ origin: "bottom", delay: 500 }}>
      <div className="profile-section mb-4 mt-24 rounded-2xl border border-gray-200/80 bg-white/95 p-6 shadow-md shadow-gray-200/70 dark:border-gray-700/70 dark:bg-gray-800/95 dark:shadow-black/20 sm:mt-28 sm:p-8 lg:mt-32 lg:p-10">
        <div className="flex items-center gap-4 sm:gap-5 lg:gap-6">
          <div className="aspect-square h-40 w-40 shrink-0 overflow-hidden rounded-full bg-gray-100 ring-4 ring-indigo-100 shadow-lg shadow-indigo-100/70 dark:bg-gray-600 dark:ring-indigo-500/20 dark:shadow-black/20 sm:h-32 sm:w-32 lg:h-36 lg:w-36">
            {displayAvatarSrc && isSafeImageSrc(displayAvatarSrc) ? (
              <Image
                src={displayAvatarSrc}
                alt={`Foto de perfil de ${name}`}
                width={128}
                height={128}
                className="h-full w-full object-cover"
                unoptimized={nextImageUnoptimized(displayAvatarSrc)}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center px-2 text-center text-sm text-gray-400 dark:text-gray-300">
                Sem foto
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex max-w-3xl flex-col items-start gap-3 text-left text-gray-700 dark:text-gray-300">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-3xl lg:text-[2rem]">
                {name || "—"}
              </h1>
            </div>
            <p className="mt-4 max-w-3xl text-left text-sm leading-7 text-gray-600 dark:text-gray-300 sm:text-base">
              {bio}
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200/80 pt-6 dark:border-gray-700/80">
          <div className="flex flex-wrap items-stretch justify-center gap-3 lg:gap-4">
            <div className="inline-flex min-h-[72px] min-w-[220px] max-w-full items-center justify-center gap-3 rounded-2xl border border-gray-200/80 bg-gray-50/80 px-4 py-3 text-center text-sm text-gray-700 shadow-sm dark:border-gray-700/80 dark:bg-gray-900/40 dark:text-gray-300">
              <Globe className="h-5 w-5 shrink-0 text-indigo-600 dark:text-indigo-400" />
              <span className="leading-snug">
                <span className="font-medium text-gray-900 dark:text-gray-100">Domínio:</span>{" "}
                <Link
                  href={`/u/${slug}`}
                  className="font-medium text-indigo-600 underline-offset-2 hover:underline dark:text-indigo-400"
                >
                  /u/{slug}
                </Link>
              </span>
            </div>
            <div className="inline-flex min-h-[72px] min-w-[220px] max-w-full items-center justify-center gap-3 rounded-2xl border border-gray-200/80 bg-gray-50/80 px-4 py-3 text-center text-sm text-gray-700 shadow-sm dark:border-gray-700/80 dark:bg-gray-900/40 dark:text-gray-300">
              <GraduationCap className="h-5 w-5 shrink-0 text-indigo-600 dark:text-indigo-400" />
              <span className="leading-snug">{gridFormation}</span>
            </div>
            <div className="inline-flex min-h-[72px] min-w-[220px] max-w-full items-center justify-center gap-3 rounded-2xl border border-gray-200/80 bg-gray-50/80 px-4 py-3 text-center text-sm text-gray-700 shadow-sm dark:border-gray-700/80 dark:bg-gray-900/40 dark:text-gray-300">
              <Shield className="h-5 w-5 shrink-0 text-indigo-600 dark:text-indigo-400" />
              <span className="leading-snug">
                <span className="font-medium text-gray-900 dark:text-gray-100">Cargo Atual:</span>{" "}
                {currentSector || "—"}
              </span>
            </div>
            <div className="inline-flex min-h-[72px] min-w-[220px] max-w-full items-center justify-center gap-3 rounded-2xl border border-gray-200/80 bg-gray-50/80 px-4 py-3 text-center text-sm text-gray-700 shadow-sm dark:border-gray-700/80 dark:bg-gray-900/40 dark:text-gray-300">
              <Code className="h-5 w-5 shrink-0 text-indigo-600 dark:text-indigo-400" />
              <span className="leading-snug">
                <span className="font-medium text-gray-900 dark:text-gray-100">Cargo Alvo:</span>{" "}
                {targetSector || "—"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </ScrollRevealWrapper>
  );
}
