import { redirect } from "next/navigation";

/** Um único painel em `/dashboard` (perfil, habilidades, projetos). Esta rota mantém links antigos. */
export default function ManageDashboardRedirect() {
  redirect("/dashboard");
}
