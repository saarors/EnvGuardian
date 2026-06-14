# EnvGuardian 🛡️  
Smart schema-based validation for your `.env` files – across environments, stacks, and teams.

## Why?

Environment variables are the backbone of your configuration, but:

- There is no single source of truth for what should exist  
- Missing or invalid values are often discovered only in production  
- Different services use different `.env` files with no validation  

EnvGuardian fixes this by letting you define a **single schema** and validate all your `.env` files against it.

## Features

- **[Single YAML schema](ca://s?q=Explain_single_YAML_schema)** for all environments  
- **[Type checking](ca://s?q=How_type_checking_works)** (`string`, `number`, `boolean`)  
- **[Constraints](ca://s?q=Env_constraints_explained)**: `required`, `enum`, `min`, `max`, `regex`  
- **[Validate multiple .env files](ca://s?q=Validate_multiple_env_files)** in one run  
- **[CI‑friendly exit codes](ca://s?q=CI_exit_codes)**  
- **[Human‑readable output](ca://s?q=Console_output_format)**  

## Install

```bash
npm install -g envguardian
# or
npx envguardian --help
```
## Quick start
**1. Create a schema file**
```yaml
# config.schema.yml
APP_PORT:
  type: number
  required: true
  min: 1024
  max: 65535

APP_ENV:
  type: string
  required: true
  enum: [development, staging, production]

JWT_SECRET:
  type: string
  required: true
  minLength: 32

ENABLE_METRICS:
  type: boolean
  required: false
```
**2. Validate your .env files**
```bash
envguardian validate \
  --schema config.schema.yml \
  --env .env.local \
  --env .env.production
```

If any required variable is missing or invalid, EnvGuardian will:

Print a detailed report

Exit with a non‑zero status code (perfect for CI)

## GitHub Actions example
```yaml
name: Env Validation

on: [push, pull_request]

jobs:
  validate-env:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm install -g envguardian
      - run: envguardian validate --schema config.schema.yml --env .env.example
```

