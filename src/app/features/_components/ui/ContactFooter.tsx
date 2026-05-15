import { FileDown, Instagram, Linkedin, Mail, Phone } from "lucide-react";

import { db } from "@/app/core/db/prisma";
import { getProfile } from "@/app/features/public/profile/server/getProfile";
import { resolveCurriculumHref } from "@/app/features/public/profile/server/resolve-curriculum-href";

type ContactFooterProps = {
  profileId?: string;
};

export default async function ContactFooter({ profileId }: ContactFooterProps = {}) {
  const profile = profileId
      ? await db.profile.findUnique({
        where: { id: profileId },
        omit: { avatarImage: true, curriculumPdf: true },
      })
    : await getProfile();

  if (!profile) return null;

  const curriculumHref = resolveCurriculumHref(profile);
  const email = profile.email ?? "";
  const phone = profile.phone ?? "";
  const linkedin = profile.linkedin ?? "";
  const instagram = profile.instagram ?? "";
  const waDigits = phone.replace(/\D/g, "");
  const waHref = waDigits ? `https://wa.me/${waDigits}` : undefined;

  return (
      <footer className="bg-background-dark py-12 text-text-dark">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h3 className="text-text-dark mb-8 text-2xl font-semibold">Contato</h3>

          <div className="mb-8 flex flex-wrap items-center justify-center gap-8">
            <a
              href={`mailto:${email}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-16 w-16 items-center justify-center rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-blue-500/20 hover:shadow-lg"
              aria-label="Email"
            >
              <Mail className="text-text-dark h-8 w-8 transition-colors duration-300 group-hover:text-blue-400" />
            </a>

            {curriculumHref ? (
              <a
                href={curriculumHref}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-16 w-16 items-center justify-center rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-violet-500/20 hover:shadow-lg"
                aria-label="Baixar currículo"
              >
                <FileDown className="text-text-dark h-8 w-8 transition-colors duration-300 group-hover:text-violet-400" />
              </a>
            ) : null}

            {waHref ? (
              <a
                href={waHref}
                target="_self"
                rel="noopener noreferrer"
                className="group flex h-16 w-16 items-center justify-center rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-green-500/20 hover:shadow-lg"
                title={phone}
                aria-label="Telefone / WhatsApp"
              >
                <Phone className="text-text-dark h-8 w-8 transition-colors duration-300 group-hover:text-green-400" />
              </a>
            ) : (
              <div
                className="group flex h-16 w-16 cursor-default items-center justify-center rounded-full opacity-50 backdrop-blur-sm"
                title="Telefone não informado"
                aria-label="Telefone não disponível"
              >
                <Phone className="text-text-dark h-8 w-8" />
              </div>
            )}

            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-16 w-16 items-center justify-center rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-blue-600/20 hover:shadow-lg"
              aria-label="LinkedIn"
            >
              <Linkedin className="text-text-dark h-8 w-8 transition-colors duration-300 group-hover:text-blue-500" />
            </a>

            <a
              href={instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-16 w-16 items-center justify-center rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-pink-500/20 hover:shadow-lg"
              aria-label="Instagram"
            >
              <Instagram className="text-text-dark h-8 w-8 transition-colors duration-300 group-hover:text-pink-400" />
            </a>
          </div>

          <div className="border-t border-gray-700 pt-6 text-sm">
            <p className="text-text-dark">
              &copy; {new Date().getFullYear()} {profile.name}. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
  );
}
