<div align="center">

<br />
<h1>Plataforma SaaS para portfólios de desenvolvedores — crie, gerencie e compartilhe seu perfil profissional em uma URL única</h1>
<br />
[![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript_5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
<br />
[🌐 Demo ao vivo](https://pagesaas.vercel.app/u/matheus-santos7) · [🐛 Reportar bug](https://github.com/Matheus-santos7/portifolioDevSaaS/issues) · [💡 Sugerir feature](https://github.com/Matheus-santos7/portifolioDevSaaS/issues)
</div>

---

## 📋 Índice

- [Sobre o projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Stack tecnológica](#-stack-tecnológica)
- [Arquitetura](#-arquitetura)
- [Rotas](#-rotas)
- [Começando](#-começando)
- [Variáveis de ambiente](#-variáveis-de-ambiente)
- [Scripts disponíveis](#-scripts-disponíveis)
- [Deploy](#-deploy)
- [API interna](#-api-interna)
- [Segurança](#-segurança)
- [Melhorias futuras](#-melhorias-futuras)
- [Autor](#-autor)

---

## 🚀 Sobre o projeto

**MS Portfólio SaaS** é uma plataforma completa que permite a desenvolvedores criar e publicar seu portfólio profissional em uma URL personalizada (`/u/seu-slug`). A aplicação combina uma landing page pública com um dashboard autenticado para gestão completa do perfil.

O visitante acessa o portfólio diretamente pela URL pública — sem cadastro, sem fricção. Toda a edição acontece no dashboard privado, protegido por autenticação própria com sessão via cookie `httpOnly`.

---

## ✨ Funcionalidades

| Área | Funcionalidade |
|------|---------------|
| 🔐 **Autenticação** | Cadastro, login, logout, recuperação de senha por e-mail |
| 👤 **Perfil** | Edição de nome, bio, avatar e informações pessoais |
| 🔗 **Slug público** | Onboarding para definir URL única (`/u/[slug]`) |
| 💼 **Projetos** | CRUD de projetos com upload de capa |
| 🛠️ **Skills** | Catálogo global de tecnologias com seleção de habilidades |
| 📜 **Certificados** | Gerenciamento de certificados e cursos |
| 📄 **Currículo** | Upload de currículo em PDF |
| 🌐 **Portfólio público** | Página pública em `/u/[slug]` para compartilhar |

---

## 🛠️ Stack tecnológica

### Frontend
- **[Next.js 15](https://nextjs.org/)** com App Router e Turbopack
- **[React 18](https://react.dev/)** com Server Components
- **[TypeScript 5](https://www.typescriptlang.org/)** — tipagem completa
- **[Tailwind CSS 3](https://tailwindcss.com/)** — estilização utility-first
- **[Lucide React](https://lucide.dev/)** + **[React Icons](https://react-icons.github.io/)** — ícones
- **[shadcn/ui](https://ui.shadcn.com/)** — componentes acessíveis

### Backend & Banco de dados
- **[Prisma 6](https://www.prisma.io/)** — ORM type-safe
- **[PostgreSQL](https://www.postgresql.org/)** — banco de dados relacional
- **[Vercel Blob](https://vercel.com/storage/blob)** — armazenamento de arquivos

### Autenticação & E-mail
- Autenticação própria com sessão por cookie `httpOnly` assinado
- **[Resend](https://resend.com/)** — envio de e-mails transacionais

### Tooling
- **pnpm** — gerenciador de pacotes
- **ESLint** + **Prettier** — linting e formatação
- **GitHub Actions** — CI/CD

---

## 🏗️ Arquitetura

O projeto segue uma separação explícita de responsabilidades por contexto. Não há componentes híbridos com flags como `editable`/`readOnly` — cada área tem seus próprios blocos de UI.

```
src/
└── app/
    ├── (marketing)/          # Landing page + fluxos de autenticação
    │   ├── login/
    │   ├── register/
    │   ├── forgot-password/
    │   └── reset-password/
    │
    ├── (public)/             # Portfólio público
    │   └── u/[slug]/         # Página pública do desenvolvedor
    │
    ├── (admin)/              # Dashboard autenticado
    │   └── dashboard/
    │       ├── manage/       # Perfil, skills, projetos, certificados
    │       └── setup-slug/   # Onboarding
    │
    ├── _components/          # Blocos visuais reutilizáveis
    ├── api/                  # Route Handlers (REST API interna)
    ├── core/                 # Prisma client, auth actions, utils compartilhados
    ├── features/             # Composição de features por contexto
    └── lib/                  # Domínio compartilhado
        ├── auth/             # Sessão, cookies, helpers
        ├── email/            # Templates e envio via Resend
        ├── storage/          # Upload de arquivos
        ├── slugs/            # Validação e geração de slugs
        └── validation/       # Schemas de validação de payloads
```

**Princípios arquiteturais:**
- `src/app` concentra rotas, API e UI
- Helpers de domínio ficam em `src/app/lib`
- A área pública principal é apenas `/u/[slug]`
- Não há acoplamento entre contexto público e privado

---

## 🗺️ Rotas

### Públicas

| Rota | Descrição |
|------|-----------|
| `/` | Landing page |
| `/login` | Página de login |
| `/register` | Cadastro de nova conta |
| `/forgot-password` | Solicitar reset de senha |
| `/reset-password` | Redefinir senha via token |
| `/u/[slug]` | **Portfólio público do desenvolvedor** |

### Autenticadas (Dashboard)

| Rota | Descrição |
|------|-----------|
| `/dashboard` | Visão geral do dashboard |
| `/dashboard/setup-slug` | Onboarding — definir slug público |
| `/dashboard/manage` | Redireciona para `/dashboard` (legado) |

---

## 🏁 Começando

### Pré-requisitos

- **Node.js** 20+
- **pnpm** 9+
- **PostgreSQL** acessível (local ou remoto — Neon, Supabase, Railway)

### 1. Clone o repositório

```bash
git clone https://github.com/Matheus-santos7/portifolioDevSaaS.git
cd portifolioDevSaaS
```

### 2. Instale as dependências

```bash
pnpm install
```

### 3. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

Preencha ao menos as variáveis obrigatórias (veja a seção completa abaixo).

### 4. Aplique as migrations

```bash
pnpm exec prisma migrate dev
```

### 5. Popule o catálogo inicial

```bash
pnpm db:seed
```

> O seed popula o catálogo global de tecnologias usado pelas skills.

### 6. Inicie o servidor de desenvolvimento

```bash
pnpm dev
```

Acesse [http://localhost:3000](http://localhost:3000) 🎉

---

## 🔑 Variáveis de ambiente

Copie `.env.example` para `.env` e preencha:

### Obrigatórias

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require"
AUTH_SESSION_SECRET="uma-string-longa-e-aleatoria-minimo-32-chars"
```

### URL da aplicação

```env
APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### E-mail (para recuperação de senha)

```env
RESEND_API_KEY="re_xxxxxxxxxxxxxxxx"
EMAIL_FROM="noreply@seudominio.com"
PASSWORD_RESET_COOLDOWN_SECONDS=60
```

> ⚠️ Em produção, a aplicação falhará no bootstrap se `DATABASE_URL` ou `AUTH_SESSION_SECRET` estiverem ausentes.

---

## 📦 Scripts disponíveis

| Script | Descrição |
|--------|-----------|
| `pnpm dev` | Servidor de desenvolvimento com Turbopack |
| `pnpm build` | Gera Prisma Client, executa migrations e faz build |
| `pnpm start` | Sobe a aplicação em modo produção |
| `pnpm lint` | Executa o ESLint |
| `pnpm typecheck` | Verificação de tipos com TypeScript |
| `pnpm db:migrate:deploy` | Aplica migrations pendentes |
| `pnpm db:seed` | Executa o seed do banco de dados |

---

## 🚢 Deploy

### Vercel (recomendado)

O projeto está otimizado para Vercel. O script de build executa automaticamente:

```
prisma generate → prisma migrate deploy → next build
```

**Comportamentos importantes:**

- Em **desenvolvimento local**: `prisma migrate deploy` é ignorado por padrão. Use `RUN_BUILD_MIGRATIONS=1` para forçar.
- Na **Vercel** (`VERCEL=1`) ou **CI** (`CI=true`): as migrations são aplicadas antes do `next build`.
- `SKIP_BUILD_MIGRATIONS=1` desativa migrations no build (apenas em cenários excepcionais).

**Resiliência a falhas de conexão (Neon):**

Se o build falhar com `P1001` (banco inacessível), o script repete automaticamente a conexão — por padrão 6 tentativas com 5s de intervalo. Configure via:

```env
PRISMA_DB_CONNECT_RETRIES=6
PRISMA_DB_RETRY_DELAY_SEC=5
```

**Reset total do banco** (apenas para ambientes de teste com poucos dados):

1. Defina `PRISMA_RESET_DB_ON_DEPLOY=1` na Vercel
2. Execute o deploy — o script roda `prisma migrate reset --force`
3. **Remova a variável imediatamente** para não apagar dados nos builds seguintes

**Resolução manual de migration com falha:**

```bash
pnpm prisma migrate resolve --rolled-back <nome_da_migration>
pnpm prisma migrate deploy
```

### Outros provedores

Configure as variáveis de ambiente e use um PostgreSQL compatível: **Neon**, **Supabase**, **Railway** ou qualquer instância gerenciada.

> 💡 Dica: adicione `connect_timeout=30` à `DATABASE_URL` ao usar o pooler do Neon.

---

## 🔌 API interna

Todos os endpoints são protegidos por sessão. Base: `/api/`

| Endpoint | Descrição |
|----------|-----------|
| `GET/PATCH /api/account/profile` | Perfil do usuário |
| `POST /api/account/avatar` | Upload de avatar |
| `POST /api/account/curriculum` | Upload de currículo PDF |
| `GET/POST /api/account/projects` | Listar e criar projetos |
| `PATCH/DELETE /api/account/projects/[id]` | Editar e remover projeto |
| `POST /api/account/projects/[id]/cover` | Upload de capa do projeto |
| `GET/POST /api/account/certificates` | Listar e criar certificados |
| `PATCH/DELETE /api/account/certificates/[id]` | Editar e remover certificado |
| `GET/POST /api/account/skills` | Listar e gerenciar skills |
| `GET /api/technologies` | Catálogo global de tecnologias |

---

## 🔒 Segurança

- Dashboard protegido por helpers centrais de sessão em todas as rotas
- Cookie de sessão assinado com `AUTH_SESSION_SECRET` (`httpOnly`, `SameSite`)
- Validação de payloads em todos os fluxos privados
- Falha antecipada em produção quando variáveis críticas estão ausentes
- `lint` e `typecheck` integrados ao fluxo de verificação de código

---

## 🌱 Melhorias futuras

Esta seção lista oportunidades de evolução identificadas na análise do projeto, organizadas por impacto e esforço.

### 🔴 Alta prioridade

- **Testes automatizados** — o projeto não possui cobertura de testes. Adicionar testes unitários com Vitest para a camada `lib/` e testes de integração para os route handlers seria o maior ganho de confiabilidade.
- **Rate limiting nas rotas de autenticação** — `/login`, `/register` e `/forgot-password` estão expostos a ataques de força bruta. Implementar rate limiting com `@upstash/ratelimit` ou middleware do Vercel é crítico para produção.
- **Validação de payloads com Zod** — padronizar a validação de entrada em todos os route handlers com um schema Zod compartilhado, eliminando validação manual dispersa.

### 🟡 Média prioridade

- **Armazenamento externo de arquivos** — avatar, currículo e capas de projeto atualmente podem ser armazenados diretamente no banco. Migrar 100% para Vercel Blob ou outro serviço de object storage melhora performance e reduz custo de banco.
- **SEO e Open Graph dinâmico** — gerar metadata dinâmica por slug (`/u/[slug]`) com `generateMetadata` do Next.js para melhorar o preview ao compartilhar o portfólio em redes sociais.
- **Paginação no dashboard** — projetos, certificados e skills não têm paginação. Com o crescimento dos dados, isso pode gerar queries lentas.
- **Internacionalização (i18n)** — o projeto está em português, mas uma estrutura i18n (next-intl) abriria o produto para o mercado global.

### 🟢 Baixa prioridade / Qualidade de vida

- **Storybook** — documentar os componentes de `_components/` em Storybook facilita onboarding de novos contribuidores e evita retrabalho visual.
- **GitHub Actions para CI** — adicionar um workflow que rode `lint` e `typecheck` em todo PR garante que o código no `main` esteja sempre válido.
- **Dark mode** — o Tailwind já suporta `dark:`, e shadcn/ui tem suporte nativo. Implementar tema escuro seria de alto impacto visual com baixo esforço.
- **Analytics de visitas** — integrar Vercel Analytics ou Plausible para que cada desenvolvedor veja quantas visitas seu portfólio recebeu.
- **Exportação do portfólio em PDF** — gerar um PDF do portfólio público (`/u/[slug]`) com `@react-pdf/renderer` para facilitar o uso em processos seletivos.
- **Correção de typo** — o nome do repositório e do `package.json` contêm "portifolio" (sem 'r'). Considerar renomear para `portfolioDevSaaS` para melhorar a indexação e profissionalismo.

---

## 👨‍💻 Autor

Desenvolvido com 💙 por **Matheus Santos**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/matheus-santos7)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/matheus-santos7)

---

<div align="center">

Se este projeto te ajudou, considere deixar uma ⭐️ no repositório!

</div>