"use client";

import { TechnologyIcon } from "@/features/skills/components/TechnologyIcon";
import type { SkillWithTechnology } from "@/features/skills/get-skills";

type SkillsPillsClientProps = {
  skills: SkillWithTechnology[];
};

function SkillPill({ skill }: { skill: SkillWithTechnology }) {
  return (
    <span className="inline-flex min-w-max shrink-0 items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-2 py-1.5 pr-3 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-900/60 dark:text-gray-100">
      <TechnologyIcon
        name={skill.technology.name}
        svgUrl={skill.technology.svgUrl}
        size={28}
      />
      <span>{skill.technology.name}</span>
    </span>
  );
}

export default function SkillsPillsClient({ skills }: SkillsPillsClientProps) {
  if (skills.length === 0) {
    return (
      <div className="profile-section relative w-full rounded-xl border border-gray-200/70 bg-white/70 py-3 shadow-sm backdrop-blur-sm dark:border-gray-700/70 dark:bg-gray-800/60">
        <div className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400">
          Nenhuma tecnologia seleccionada ainda.
        </div>
      </div>
    );
  }

  const loop = [...skills, ...skills];
  const durationSec = Math.min(60, Math.max(24, skills.length * 3));

  const edgeFade =
    "pointer-events-none absolute inset-y-0 z-[1] w-10 from-white/95 to-transparent dark:from-gray-800/95";

  return (
    <div
      className="profile-section group relative w-full overflow-hidden rounded-xl border border-gray-200/70 bg-white/70 shadow-sm backdrop-blur-sm dark:border-gray-700/70 dark:bg-gray-800/60"
      aria-label="Lista de tecnologias"
    >
      <div className={`${edgeFade} left-0 bg-gradient-to-r`} aria-hidden />
      <div className={`${edgeFade} right-0 bg-gradient-to-l`} aria-hidden />

      <div className="motion-reduce:hidden overflow-hidden py-3">
        <div
          className="flex w-max items-center gap-3 px-3 animate-marquee hover:[animation-play-state:paused]"
          style={{ animationDuration: `${durationSec}s` }}
        >
          {loop.map((skill, index) => (
            <SkillPill key={`${skill.id}-${index}`} skill={skill} />
          ))}
        </div>
      </div>

      <div className="hidden motion-reduce:block motion-reduce:overflow-x-auto motion-reduce:py-3 motion-reduce:[scrollbar-width:thin]">
        <div className="flex w-max touch-pan-x items-center gap-3 px-3">
          {skills.map((skill) => (
            <SkillPill key={skill.id} skill={skill} />
          ))}
        </div>
      </div>
    </div>
  );
}
