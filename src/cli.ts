import { runValidation } from './index';

export function printHelp() {
  console.log(`
EnvGuardian 🛡️ – .env schema validation

Usage:
  envguardian validate --schema <schema.yml> --env <file1> [--env <file2> ...]

Options:
  --schema   Path to YAML schema file
  --env      Path to .env file (can be repeated)
  --help     Show this help
`);
}

export async function runCli() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.length === 0) {
    printHelp();
    return;
  }

  const command = args[0];

  if (command !== 'validate') {
    console.error(`Unknown command: ${command}`);
    printHelp();
    process.exit(1);
  }

  let schemaPath: string | undefined;
  const envPaths: string[] = [];

  for (let i = 1; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--schema') {
      schemaPath = args[++i];
    } else if (arg === '--env') {
      envPaths.push(args[++i]);
    }
  }

  if (!schemaPath || envPaths.length === 0) {
    console.error('Missing --schema or --env arguments.');
    printHelp();
    process.exit(1);
  }

  const success = await runValidation({
    schemaPath,
    envPaths,
  });

  process.exit(success ? 0 : 1);
}
