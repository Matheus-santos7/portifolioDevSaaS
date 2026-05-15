# MSPortifólio SaaS

SaaS de portfólio para desenvolvedores, com página pública em `/u/[slug]`, dashboard autenticado e arquitetura organizada por contexto.

## Visão geral
O projeto permite que uma pessoa desenvolvedora:

- crie uma conta;
- escolha um slug público;
- edite perfil, habilidades, projetos, certificados e currículo;
- publique tudo em uma URL única para compartilhar em currículo, LinkedIn ou propostas.

Hoje a superfície pública oficial do produto é enxuta: o visitante consome o conteúdo diretamente em `/u/[slug]`. Toda a edição acontece no dashboard autenticado.

## O que existe no produto
- Landing page e fluxos de autenticação.
- Portfólio público por slug.
- Dashboard para gerenciar perfil, skills, projetos e certificados.
- Upload de avatar, currículo PDF e capa de projeto.
- Recuperação de senha por e-mail.
- Onboarding para definição do slug público.

## Stack
- Next.js 15 com App Router
- React 18
- TypeScript 5
- Tailwind CSS
- Prisma
- PostgreSQL
- pnpm
- Deploy orientado para Vercel

## Arquitetura
O projeto segue uma separação explícita por contexto:

```text
src/
├── app/
│   ├── (marketing)/        # landing + auth
│   ├── (public)/           # página pública /u/[slug]
│   ├── (admin)/            # dashboard autenticado
│   ├── _components/        # blocos visuais reutilizáveis
│   └── api/                # route handlers
├── modules/
│   ├── admin/              # composição das telas privadas
│   ├── public/             # composição das telas públicas
│   ├── profile/shared/     # view models e loaders de perfil
│   ├── projects/shared/    # loaders e helpers de projetos
│   └── certificates/shared/# loaders e helpers de certificados
└── lib/
    ├── actions/            # server actions
    ├── auth/               # sessão, login, registro e reset
    ├── db/                 # Prisma Client
    ├── domain/             # helpers e queries por domínio
    ├── hooks/              # hooks reutilizáveis
    ├── site/               # helpers de URL e ambiente
    ├── slugs/              # regras de slug
    ├── technologies/       # catálogo e presets
    └── validation/         # schemas e normalização de payload
```

Princípios que guiam o código:

- `src/app` deve ficar fino e delegar a composição real para `src/modules`;
- regras de domínio e acesso a dados ficam em `src/lib`;
- não há componentes híbridos com flags como `editable` e `readOnly`;
- a área pública principal é só `/u/[slug]`.

## Rotas principais
- `/` - landing page
- `/login` - login
- `/register` - cadastro
- `/forgot-password` - solicitar reset de senha
- `/reset-password` - redefinir senha
- `/u/[slug]` - página pública do portfólio
- `/dashboard` - dashboard autenticado
- `/dashboard/setup-slug` - onboarding do slug
- `/dashboard/manage` - rota legada que redireciona para `/dashboard`

## Como rodar localmente
### Pré-requisitos
- Node.js 20+
- pnpm 9+
- PostgreSQL acessível localmente ou remotamente

### 1. Instale as dependências
```bash
pnpm install
```

### 2. Configure o ambiente
```bash
cp .env.example .env
```

Preencha pelo menos:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require"
AUTH_SESSION_SECRET="uma-string-longa-e-aleatoria"
APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

Se quiser testar recuperação de senha por e-mail, configure também:

```env
RESEND_API_KEY=
EMAIL_FROM=
```

### 3. Aplique as migrations
```bash
pnpm exec prisma migrate dev
```

### 4. Popule o catálogo inicial
```bash
pnpm db:seed
```

O seed popula o catálogo global de tecnologias usado pelas skills.

### 5. Suba o projeto
```bash
pnpm dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Scripts
- `pnpm dev` - desenvolvimento com Turbopack
- `pnpm build` - gera o Prisma Client, executa migrations quando aplicável e faz o build do Next.js
- `pnpm start` - sobe a aplicação em modo produção
- `pnpm lint` - executa o lint
- `pnpm typecheck` - checa os tipos com TypeScript
- `pnpm db:migrate:deploy` - aplica migrations pendentes
- `pnpm db:seed` - executa o seed do banco

## Prisma e banco de dados
- O schema está em `prisma/schema.prisma`.
- A configuração do Prisma CLI está em `prisma.config.ts`.
- As migrations ficam em `prisma/migrations`.
- O seed roda `prisma/seed.ts`.

O projeto depende de PostgreSQL para funcionar. Hoje avatar, currículo PDF e capa de projeto também podem ser armazenados diretamente no banco.

## Variáveis de ambiente
Obrigatórias em produção:

- `DATABASE_URL`
- `AUTH_SESSION_SECRET`

Relevantes para links, metadata e e-mails:

- `APP_URL`
- `NEXT_PUBLIC_APP_URL`
- `RESEND_API_KEY`
- `EMAIL_FROM`
- `PASSWORD_RESET_COOLDOWN_SECONDS`

Em produção, a aplicação falha cedo no bootstrap se `DATABASE_URL` ou `AUTH_SESSION_SECRET` estiverem ausentes.

## Autenticação e integrações
- Autenticação própria com sessão por cookie `httpOnly`
- PostgreSQL como banco principal
- Prisma como ORM
- Resend para envio de e-mails de reset de senha
- Vercel como plataforma de deploy recomendada

## Build e deploy
O comando de build do projeto é:

```bash
pnpm build
```

Internamente ele executa:

```bash
prisma generate && node scripts/run-build-migrations.mjs && next build
```

Comportamento importante:

- em build local, `prisma migrate deploy` é ignorado por defeito (usa `RUN_BUILD_MIGRATIONS=1` para forçar);
- na Vercel (`VERCEL=1`) ou em CI (`CI=true`), as migrations aplicam-se antes do `next build`;
- `SKIP_BUILD_MIGRATIONS=1` na Vercel desativa migrate no build (só em cenários excecionais).

### P3009 — migração `20260509203000_technology_catalog_skill_fk` falhada

Se o deploy falhar com **P3009** e o log da base mencionar **`Technology` already exists**, a migração no repo é **idempotente** (reaplicável). Na Neon/produção corre **uma vez**, com `DATABASE_URL` de produção:

```bash
pnpm prisma migrate resolve --rolled-back 20260509203000_technology_catalog_skill_fk
pnpm prisma migrate deploy
```

Depois volta a fazer deploy na Vercel. Se o schema já estiver 100% aplicado e só o histórico Prisma estiver errado, usa `--applied` em vez de `--rolled-back` (vê [documentação Prisma](https://www.prisma.io/docs/guides/migrate/production-troubleshooting)).

Para deploy, configure as variáveis de ambiente no provedor e use um PostgreSQL compatível, como Neon, Supabase, Railway ou outra instância PostgreSQL gerenciada.

## Endpoints internos relevantes
- `/api/account/profile`
- `/api/account/avatar`
- `/api/account/curriculum`
- `/api/account/projects`
- `/api/account/projects/[id]`
- `/api/account/projects/[id]/cover`
- `/api/account/certificates`
- `/api/account/certificates/[id]`
- `/api/account/skills`
- `/api/technologies`

## Qualidade e segurança
- dashboard protegido por helpers centrais de sessão;
- cookie de sessão assinado;
- validação de payloads nos fluxos privados;
- `lint` e `typecheck` no fluxo de verificação;
- falha antecipada em produção quando faltam variáveis críticas.

## Autor
Desenvolvido por [Matheus Santos](https://linkedin.com/in/matheus-santos7).

- GitHub: [@matheus-santos7](https://github.com/matheus-santos7)