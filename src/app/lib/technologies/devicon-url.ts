/**
 * Base do [Devicon](https://github.com/devicons/devicon) — mesma fonte do [TechIcons](https://techicons.dev/).
 */
export function deviconSvgUrl(iconFolder: string, fileName: string) {
  return `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${iconFolder}/${fileName}`;
}
