"use client";

import { FileDown, Instagram, Linkedin, Mail, Phone } from "lucide-react";

import ScrollRevealWrapper from "@/core/ui/ScrollRevealWrapper";

interface ContactFooterProps {
  name: string;
  email: string;
  phone: string;
  linkedin: string;
  instagram: string;
  curriculumHref?: string | null;
}

export function ContactFooter({
  name,
  email,
  phone,
  linkedin,
  instagram,
  curriculumHref,
}: ContactFooterProps) {
  return (
    <ScrollRevealWrapper
      className="certificate-card"
      options={{ origin: "bottom", delay: 500 }}
    >
      <footer className="bg-background-dark py-12 text-text-dark">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h3 className="text-text-dark mb-8 text-2xl font-semibold">
            Contato
          </h3>

          <div className="mb-8 flex flex-wrap items-center justify-center gap-8">
            <a
              href={`mailto:${email}`}
              target="_blank"
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

            <div
              className="group flex h-16 w-16 cursor-default items-center justify-center rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-green-500/20 hover:shadow-lg"
              title={phone}
              aria-label="Telefone"
              onClick={() => {
                const phoneNumber = phone.replace(/\D/g, "");
                window.open(`https://wa.me/${phoneNumber}`, "_self");
              }}
            >
              <Phone className="text-text-dark h-8 w-8 transition-colors duration-300 group-hover:text-green-400" />
            </div>

            <a
              href={linkedin}
              target="_blank"
              className="group flex h-16 w-16 items-center justify-center rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-blue-600/20 hover:shadow-lg"
              aria-label="LinkedIn"
            >
              <Linkedin className="text-text-dark h-8 w-8 transition-colors duration-300 group-hover:text-blue-500" />
            </a>

            <a
              href={instagram}
              target="_blank"
              className="group flex h-16 w-16 items-center justify-center rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-pink-500/20 hover:shadow-lg"
              aria-label="Instagram"
            >
              <Instagram className="text-text-dark h-8 w-8 transition-colors duration-300 group-hover:text-pink-400" />
            </a>
          </div>

          <div className="border-t border-gray-700 pt-6 text-sm">
            <p className="text-text-dark">
              &copy; {new Date().getFullYear()} {name}. Todos os direitos
              reservados.
            </p>
          </div>
        </div>
      </footer>
    </ScrollRevealWrapper>
  );
}
