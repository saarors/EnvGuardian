import fs from 'fs/promises';
import path from 'path';

export type EnvVars = Record<string, string>;

export async function parseEnvFile(envPath: string): Promise<EnvVars> {
  const fullPath = path.resolve(envPath);
  const content = await fs.readFile(fullPath, 'utf8');

  const result: EnvVars = {};

  const lines = content.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) continue;

    const key = trimmed.slice(0, eqIndex).trim();
    let value = trimmed.slice(eqIndex + 1).trim();

    // Remove surrounding quotes if present
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    result[key] = value;
  }

  return result;
}
