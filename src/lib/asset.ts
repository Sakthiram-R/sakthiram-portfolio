import {basePath} from './base-path.mjs';

/** Resolve a public/ file at the deployment base path (never include public/). */
export function asset(path: string): string {
  // Leave absolute URLs, protocol-relative URLs, and in-page references alone.
  if (!path || /^(?:[a-z][a-z\d+.-]*:|\/\/|[?#])/i.test(path)) return path;
  const local = path.startsWith('/') ? path : `/${path}`;
  if (!basePath || local === basePath || local.startsWith(`${basePath}/`) ||
      local.startsWith(`${basePath}?`) || local.startsWith(`${basePath}#`)) return local;
  return `${basePath}${local}`;
}
