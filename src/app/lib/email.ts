type SendEmailInput = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

/** Remove aspas externas comuns em .env ("..."). */
function trimQuoted(value: string) {
  const t = value.trim();
  if (
    t.length >= 2 &&
    ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'")))
  ) {
    return t.slice(1, -1).trim();
  }
  return t;
}

/**
 * Resend exige `email@dominio.com` ou `Nome <email@dominio.com>`.
 * Sem EMAIL_FROM, usa o remetente de teste da Resend (limite: em geral só para o e-mail da conta).
 */
function getResendFrom() {
  const fromEnv = trimQuoted(process.env.EMAIL_FROM ?? "");
  if (fromEnv) return fromEnv;
  return "PageDEV SaaS <onboarding@resend.dev>";
}

async function sendWithResend(input: SendEmailInput) {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) {
    return false;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: getResendFrom(),
      to: [input.to],
      subject: input.subject,
      text: input.text,
      html: input.html,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Resend: ${response.status} ${detail}`);
  }
  return true;
}

async function sendEmail(input: SendEmailInput) {
  const sent = await sendWithResend(input);
  if (sent) return;

  if (process.env.NODE_ENV !== "production") {
    console.info(
      "[email] (dev) Defina RESEND_API_KEY para enviar pela Resend. Corpo:",
      input.text,
    );
    return;
  }

  throw new Error(
    "E-mail: defina RESEND_API_KEY no ambiente. Opcional: EMAIL_FROM com dominio verificado na Resend.",
  );
}

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  const subject = "Redefinicao de senha - PageDEV SaaS";
  const text = [
    "Você solicitou redefinir sua senha.",
    "",
    `Abra o link abaixo (válido por 1 hora):`,
    resetUrl,
    "",
    "Se não foi você, ignore este e-mail.",
  ].join("\n");

  const html = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="utf-8" /></head><body style="font-family: system-ui, sans-serif; line-height: 1.5; color: #111;">
<p>Você solicitou redefinir sua senha.</p>
<p><a href="${resetUrl}">Redefinir senha</a> — link válido por <strong>1 hora</strong>.</p>
<p style="font-size: 0.875rem; color: #555;">Se não foi você, pode ignorar este e-mail com segurança.</p>
</body></html>`;

  await sendEmail({ to, subject, text, html });
}
