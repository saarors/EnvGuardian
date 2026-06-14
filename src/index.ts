import { loadSchema } from './schema/loader';
import { parseEnvFile } from './env/parser';
import { validateEnv } from './env/validator';
import { consoleReporter } from './reporters/consoleReporter';

export interface RunOptions {
  schemaPath: string;
  envPaths: string[];
}

export async function runValidation(options: RunOptions): Promise<boolean> {
  const schema = await loadSchema(options.schemaPath);

  let allValid = true;

  for (const envPath of options.envPaths) {
    const envVars = await parseEnvFile(envPath);
    const result = validateEnv(schema, envVars);
    consoleReporter(envPath, result);
    if (!result.valid) {
      allValid = false;
    }
  }

  return allValid;
}
