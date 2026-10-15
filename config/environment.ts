type TargetName = 'FRONTEND_URL' | 'BACKEND_URL';

function targetUrl(name: TargetName, legacyName: string, fallback: string): string {
  const value = [process.env[name], process.env[legacyName]]
    .map((candidate) => candidate?.trim())
    .find((candidate) => candidate !== undefined && candidate.length > 0) ?? fallback;

  let parsed: URL;

  try {
    parsed = new URL(value);
  } catch {
    throw new Error(`${name} must be a valid HTTP or HTTPS origin.`);
  }

  if (!['http:', 'https:'].includes(parsed.protocol) || parsed.username || parsed.password) {
    throw new Error(`${name} must be a valid HTTP or HTTPS origin without embedded credentials.`);
  }

  return parsed.origin;
}

export const frontendURL = targetUrl('FRONTEND_URL', 'QA_BASE_URL', 'http://localhost:3011');
export const backendURL = targetUrl('BACKEND_URL', 'QA_API_URL', 'http://localhost:4040');
