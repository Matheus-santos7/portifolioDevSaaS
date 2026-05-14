"use client";

import { Loader2, Upload } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

import { isDbAvatarSrc } from "@/features/profile/avatar-display";

type AvatarUploadCircleProps = {
  sizePx: number;
  displaySrc: string | undefined;
  alt: string;
  interactive?: boolean;
  isUploading?: boolean;
  onPickFile?: (file: File) => void;
  emptyHint?: string;
};

function isSafeImageSrc(src: string) {
  return src.startsWith("/") || src.startsWith("http://") || src.startsWith("https://");
}

export function AvatarUploadCircle({
  sizePx,
  displaySrc,
  alt,
  interactive = false,
  isUploading = false,
  onPickFile,
  emptyHint = "Sem foto",
}: AvatarUploadCircleProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const dragDepth = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

  function consumeFile(file: File | undefined) {
    if (!file || !onPickFile || isUploading) return;
    onPickFile(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    dragDepth.current = 0;
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    consumeFile(file);
  }

  function handleDragOver(e: React.DragEvent) {
    if (!interactive || isUploading) return;
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "copy";
  }

  function handleDragEnter(e: React.DragEvent) {
    if (!interactive || isUploading) return;
    e.preventDefault();
    dragDepth.current += 1;
    setIsDragging(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    if (!interactive || isUploading) return;
    e.preventDefault();
    dragDepth.current = Math.max(0, dragDepth.current - 1);
    if (dragDepth.current === 0) setIsDragging(false);
  }

  const showImage = Boolean(displaySrc && isSafeImageSrc(displaySrc));

  const dragRing =
    interactive && !isUploading && isDragging
      ? "ring-2 ring-violet-500 ring-offset-2 ring-offset-white dark:ring-offset-gray-800"
      : "";

  const boxClass =
    `relative shrink-0 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-600 ${dragRing} ` +
    (interactive && !isUploading
      ? "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-500/30"
      : "");

  const boxStyle = { width: sizePx, height: sizePx };

  const body =
    isUploading ? (
      <div className="flex h-full w-full items-center justify-center bg-gray-100 dark:bg-gray-600">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600 dark:text-violet-400" />
      </div>
    ) : showImage ? (
      <Image
        src={displaySrc!}
        alt={alt}
        width={sizePx}
        height={sizePx}
        className="h-full w-full object-cover"
        unoptimized={isDbAvatarSrc(displaySrc!)}
      />
    ) : (
      <div className="flex h-full flex-col items-center justify-center gap-1 px-2 text-center">
        {interactive ? (
          <>
            <Upload className="h-7 w-7 text-gray-400 dark:text-gray-300" aria-hidden />
            <span className="text-xs font-medium leading-tight text-violet-600 dark:text-violet-400">
              Clique ou arraste
            </span>
            <span className="text-[10px] leading-tight text-gray-500 dark:text-gray-400">
              ate 512 KB
            </span>
          </>
        ) : (
          <span className="text-sm text-gray-400 dark:text-gray-300">{emptyHint}</span>
        )}
      </div>
    );

  const commonDrag = interactive
    ? {
        onDragEnter: handleDragEnter,
        onDragLeave: handleDragLeave,
        onDragOver: handleDragOver,
        onDrop: handleDrop,
      }
    : {};

  return (
    <div className="flex flex-col items-center gap-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          consumeFile(file);
        }}
      />
      {interactive && !isUploading ? (
        <button
          type="button"
          className={`${boxClass} block border-0 p-0 outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800`}
          style={boxStyle}
          aria-label="Escolher ou largar foto de perfil aqui"
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
          {...commonDrag}
        >
          {body}
        </button>
      ) : (
        <div className={boxClass} style={boxStyle}>
          {body}
        </div>
      )}
      {!showImage && !isUploading && interactive ? (
        <span className="max-w-[10rem] text-center text-[10px] text-gray-500 dark:text-gray-400">
          JPG, PNG, WebP ou GIF
        </span>
      ) : null}
    </div>
  );
}
