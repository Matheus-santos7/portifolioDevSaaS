import { deviconSvgUrl } from "./devicon-url";
import { normalizeTechnologyNameKey } from "./technology-name-key";

/**
 * Presets populares para 2025–2026 ([Devicon](https://github.com/devicons/devicon) / [TechIcons](https://techicons.dev/)).
 * [displayName, pasta devicon, ficheiro, nameKey opcional]
 */
const PRESET_ROWS = [
  ["TypeScript", "typescript", "typescript-original.svg"],
  ["JavaScript", "javascript", "javascript-original.svg"],
  ["Python", "python", "python-original.svg"],
  ["Rust", "rust", "rust-original.svg"],
  ["Go", "go", "go-original-wordmark.svg", "go"],
  ["Java", "java", "java-original-wordmark.svg"],
  ["Kotlin", "kotlin", "kotlin-original-wordmark.svg"],
  ["Swift", "swift", "swift-original.svg"],
  ["C#", "csharp", "csharp-plain.svg", "c#"],
  ["C++", "cplusplus", "cplusplus-plain.svg", "c++"],
  ["C", "c", "c-plain.svg", "c"],
  ["PHP", "php", "php-plain.svg"],
  ["Ruby", "ruby", "ruby-original-wordmark.svg"],
  ["Scala", "scala", "scala-original-wordmark.svg"],
  ["Elixir", "elixir", "elixir-original-wordmark.svg"],
  ["React", "react", "react-original.svg"],
  ["Next.js", "nextjs", "nextjs-plain.svg", "next.js"],
  ["Vue.js", "vuejs", "vuejs-original-wordmark.svg", "vue.js"],
  ["Nuxt", "nuxtjs", "nuxtjs-plain-wordmark.svg", "nuxt"],
  ["Angular", "angular", "angular-original.svg"],
  ["Svelte", "svelte", "svelte-plain.svg"],
  ["Astro", "astro", "astro-plain.svg"],
  ["Remix", "remix", "remix-original-wordmark.svg"],
  ["Node.js", "nodejs", "nodejs-plain-wordmark.svg", "node.js"],
  ["Bun", "bun", "bun-plain.svg"],
  ["Deno", "denojs", "denojs-original-wordmark.svg", "deno"],
  ["Express", "express", "express-original-wordmark.svg"],
  ["NestJS", "nestjs", "nestjs-line.svg", "nestjs"],
  ["FastAPI", "fastapi", "fastapi-original-wordmark.svg"],
  ["Django", "django", "django-plain-wordmark.svg"],
  ["Flask", "flask", "flask-original-wordmark.svg"],
  ["Spring", "spring", "spring-original-wordmark.svg"],
  ["Ruby on Rails", "rails", "rails-original-wordmark.svg", "ruby on rails"],
  ["GraphQL", "graphql", "graphql-plain-wordmark.svg"],
  ["tRPC", "typescript", "typescript-original.svg", "trpc"],
  ["Tailwind CSS", "tailwindcss", "tailwindcss-plain.svg", "tailwind css"],
  ["HTML5", "html5", "html5-plain-wordmark.svg", "html5"],
  ["CSS3", "css3", "css3-plain-wordmark.svg", "css3"],
  ["Sass", "sass", "sass-original.svg"],
  ["Bootstrap", "bootstrap", "bootstrap-original-wordmark.svg"],
  ["Vite", "vitejs", "vitejs-original.svg"],
  ["Vitest", "vitest", "vitest-plain.svg"],
  ["Jest", "jest", "jest-plain.svg"],
  ["Playwright", "playwright", "playwright-plain.svg"],
  ["Webpack", "webpack", "webpack-original-wordmark.svg"],
  ["ESLint", "eslint", "eslint-original-wordmark.svg"],
  ["Prisma", "prisma", "prisma-original.svg"],
  ["PostgreSQL", "postgresql", "postgresql-plain-wordmark.svg", "postgresql"],
  ["MySQL", "mysql", "mysql-original-wordmark.svg"],
  ["MongoDB", "mongodb", "mongodb-plain-wordmark.svg"],
  ["Redis", "redis", "redis-original-wordmark.svg"],
  ["SQLite", "sqlite", "sqlite-original-wordmark.svg"],
  ["Apache Kafka", "apachekafka", "apachekafka-original-wordmark.svg", "apache kafka"],
  ["RabbitMQ", "rabbitmq", "rabbitmq-original-wordmark.svg"],
  ["Elasticsearch", "elasticsearch", "elasticsearch-original-wordmark.svg"],
  ["Docker", "docker", "docker-plain-wordmark.svg"],
  ["Kubernetes", "kubernetes", "kubernetes-plain-wordmark.svg"],
  ["Terraform", "terraform", "terraform-original-wordmark.svg"],
  ["Ansible", "ansible", "ansible-plain-wordmark.svg"],
  ["Jenkins", "jenkins", "jenkins-line.svg"],
  ["GitHub Actions", "githubactions", "githubactions-plain.svg", "github actions"],
  ["GitLab", "gitlab", "gitlab-original-wordmark.svg"],
  ["AWS", "amazonwebservices", "amazonwebservices-original-wordmark.svg", "aws"],
  ["Google Cloud", "googlecloud", "googlecloud-plain-wordmark.svg", "google cloud"],
  ["Azure", "azure", "azure-original-wordmark.svg"],
  ["Firebase", "firebase", "firebase-plain-wordmark.svg"],
  ["Supabase", "supabase", "supabase-original-wordmark.svg"],
  ["Vercel", "vercel", "vercel-original-wordmark.svg"],
  ["Nginx", "nginx", "nginx-original.svg"],
  ["Linux", "linux", "linux-original.svg"],
  ["Bash", "bash", "bash-original.svg"],
  ["Git", "git", "git-original-wordmark.svg"],
  ["GitHub", "github", "github-original-wordmark.svg"],
  ["VS Code", "vscode", "vscode-original-wordmark.svg", "vs code"],
  ["Figma", "figma", "figma-plain.svg"],
  ["Prometheus", "prometheus", "prometheus-original-wordmark.svg"],
  ["Grafana", "grafana", "grafana-original-wordmark.svg"],
  ["PyTorch", "pytorch", "pytorch-original-wordmark.svg"],
  ["TensorFlow", "tensorflow", "tensorflow-original.svg"],
  ["SolidJS", "solidjs", "solidjs-original.svg"],
  ["Electron", "electron", "electron-original-wordmark.svg"],
] as const;

type TechnologyPreset = {
  name: string;
  nameKey: string;
  svgUrl: string;
};

let cachedLookup: Map<string, string> | null = null;

export function getAllTechnologyPresets(): TechnologyPreset[] {
  return PRESET_ROWS.map((row) => {
    const [name, folder, file, explicitKey] = row;
    const nameKey =
      typeof explicitKey === "string"
        ? normalizeTechnologyNameKey(explicitKey)
        : normalizeTechnologyNameKey(name);
    return {
      name,
      nameKey,
      svgUrl: deviconSvgUrl(folder, file),
    };
  });
}

/** URL do ícone se o `nameKey` coincidir com um preset (após normalização). */
export function guessPresetSvgUrl(nameKey: string): string | null {
  if (!cachedLookup) {
    cachedLookup = new Map();
    for (const p of getAllTechnologyPresets()) {
      cachedLookup.set(p.nameKey, p.svgUrl);
    }
  }
  return cachedLookup.get(normalizeTechnologyNameKey(nameKey)) ?? null;
}
