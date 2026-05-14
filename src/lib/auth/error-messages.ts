/** Códigos curtos na URL (`?err=`) — mensagens só na UI. */

export const LOGIN_ERROR_MESSAGES: Record<string, string> = {
  "1": "Não há cadastro com este e-mail. Crie uma conta ou verifique o endereço.",
  "2":
    "Não há senha cadastrada para este e-mail neste sistema (conta antiga ou importada). Use Esqueci minha senha para receber um link e definir a senha — vale também como primeira senha.",
  "3": "E-mail ou senha incorretos.",
  "4": "Conta sem perfil ativo.",
};

export const REGISTER_ERROR_MESSAGES: Record<string, string> = {
  "1": "Dados inválidos. Confira nome, e-mail e senha (mínimo 8 caracteres).",
  "2": "Não foi possível criar seu perfil. Tente novamente.",
};

export const FORGOT_PASSWORD_ERROR_MESSAGES: Record<string, string> = {
  "1": "Informe um e-mail válido.",
  "2": "Validação de segurança falhou. Tente novamente.",
};

export const RESET_PASSWORD_ERROR_MESSAGES: Record<string, string> = {
  "1": "O link expirou ou já foi usado. Solicite um novo em Esqueci minha senha.",
  "2": "Senha inválida ou não confere com a confirmação.",
};

export function loginRedirectWithEmail(email: string, errCode: string) {
  const p = new URLSearchParams();
  p.set("err", errCode);
  const trimmed = email.trim();
  if (trimmed) p.set("email", trimmed);
  return `/login?${p.toString()}`;
}
