/**
 * Upload de foto de perfil via POST /api/account/avatar (Vercel Blob).
 * Resposta devolve `avatarUrl` (HTTPS público) para usar em `<Image src />`.
 */
export async function uploadProfileAvatarFile(file: File): Promise<
  { ok: true; avatarUrl: string } | { ok: false; error: string }
> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/account/avatar", {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  const data = (await response.json().catch(() => ({}))) as {
    avatarUrl?: string;
    error?: string;
  };

  if (!response.ok) {
    return { ok: false, error: data.error ?? "Falha no upload." };
  }
  if (!data.avatarUrl || typeof data.avatarUrl !== "string") {
    return { ok: false, error: "Resposta invalida do servidor." };
  }

  return { ok: true, avatarUrl: data.avatarUrl };
}
