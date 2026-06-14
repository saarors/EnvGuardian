import fs from 'fs/promises';
import path from 'path';
import { parse as parseYaml } from 'yaml';
import { Schema } from './types';

export async function loadSchema(schemaPath: string): Promise<Schema> {
  const fullPath = path.resolve(schemaPath);
  const content = await fs.readFile(fullPath, 'utf8');
  const parsed = parseYaml(content);

  if (typeof parsed !== 'object' || parsed === null) {
    throw new Error('Schema file must contain a YAML object at the root.');
  }

  return parsed as Schema;
}
