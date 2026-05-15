"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

import { useCarouselScroll } from "@/app/core/hooks/useCarouselScroll";

type CarouselProps<T extends { id: string }> = {
  items: T[];
  renderItem: (item: T) => ReactNode;
  sectionTitle?: ReactNode;
  belowIndicators?: ReactNode;
  onItemClick?: (item: T) => void;
  emptyMessage?: ReactNode;
  previousButtonLabel?: string;
  nextButtonLabel?: string;
  centerWhenNotOverflowing?: boolean;
  enableSnap?: boolean;
};

export default function Carousel<T extends { id: string }>({
  items,
  renderItem,
  sectionTitle,
  belowIndicators,
  onItemClick,
  emptyMessage = "Nenhum item cadastrado no momento.",
  previousButtonLabel = "Voltar itens",
  nextButtonLabel = "Avançar itens",
  centerWhenNotOverflowing = false,
  enableSnap = false,
}: CarouselProps<T>) {
  const {
    activeIndex,
    canScrollLeft,
    canScrollRight,
    containerRef,
    handleScroll,
    isOverflowing,
  } = useCarouselScroll({ itemsLength: items.length });

  const navigation = (
    <div className="flex shrink-0 items-center gap-2">
      <button
        type="button"
        onClick={() => handleScroll("left")}
        aria-label={previousButtonLabel}
        disabled={!canScrollLeft || items.length === 0}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 transition-colors hover:border-indigo-500 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:border-indigo-500 dark:hover:text-indigo-400"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => handleScroll("right")}
        aria-label={nextButtonLabel}
        disabled={!canScrollRight || items.length === 0}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 transition-colors hover:border-indigo-500 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:border-indigo-500 dark:hover:text-indigo-400"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );

  if (items.length === 0) {
    return (
      <div className="relative">
        {sectionTitle ? (
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <h2 className="w-full text-center text-2xl font-bold text-gray-900 dark:text-gray-100 sm:flex-1 sm:text-left">
              {sectionTitle}
            </h2>
          </div>
        ) : null}
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {emptyMessage}
        </p>
        {belowIndicators ? <div className="mt-5 flex justify-center">{belowIndicators}</div> : null}
      </div>
    );
  }

  return (
    <div className="relative">
      {sectionTitle ? (
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <h2 className="w-full text-center text-2xl font-bold text-gray-900 dark:text-gray-100 sm:flex-1 sm:text-left">
            {sectionTitle}
          </h2>
          {navigation}
        </div>
      ) : (
        <div className="mb-4 flex flex-wrap items-center justify-end gap-2">{navigation}</div>
      )}

      <div
        ref={containerRef}
        className={`flex items-stretch gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${
          enableSnap ? "snap-x snap-mandatory" : ""
        } ${
          centerWhenNotOverflowing && !isOverflowing ? "justify-center" : ""
        }`}
      >
        {items.map((item) => (
          <div
            key={item.id}
            className="flex min-h-0 w-[300px] shrink-0 snap-start flex-col sm:w-[340px] lg:w-[360px] xl:w-[380px]"
          >
            <div
              className={`flex h-full min-h-0 w-full flex-1 flex-col ${
                onItemClick ? "cursor-pointer" : ""
              }`}
              title={onItemClick ? "Clique para editar" : undefined}
              onClick={onItemClick ? () => onItemClick(item) : undefined}
            >
              {renderItem(item)}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 flex justify-center gap-2">
        {items.map((item, idx) => (
          <span
            key={`indicator-${item.id}`}
            className={`h-1.5 rounded-full transition-all ${
              idx === activeIndex
                ? "w-5 bg-indigo-500 dark:bg-indigo-400"
                : "w-1.5 bg-gray-300 dark:bg-gray-600"
            }`}
          />
        ))}
      </div>

      {belowIndicators ? <div className="mt-5 flex justify-center">{belowIndicators}</div> : null}
    </div>
  );
}
