import { Schema, VariableSchema } from '../schema/types';
import { EnvVars } from './parser';

export interface ValidationIssue {
  key: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  issues: ValidationIssue[];
}

export function validateEnv(schema: Schema, env: EnvVars): ValidationResult {
  const issues: ValidationIssue[] = [];

  for (const [key, rules] of Object.entries<VariableSchema>(schema)) {
    const rawValue = env[key];

    if (rawValue === undefined || rawValue === null || rawValue === '') {
      if (rules.required) {
        issues.push({
          key,
          message: 'Missing required variable',
        });
      }
      continue;
    }

    // Type coercion
    let value: string | number | boolean = rawValue;

    if (rules.type === 'number') {
      const num = Number(rawValue);
      if (Number.isNaN(num)) {
        issues.push({
          key,
          message: `Expected number, got "${rawValue}"`,
        });
        continue;
      }
      value = num;
    } else if (rules.type === 'boolean') {
      const lowered = rawValue.toLowerCase();
      if (['true', '1', 'yes'].includes(lowered)) {
        value = true;
      } else if (['false', '0', 'no'].includes(lowered)) {
        value = false;
      } else {
        issues.push({
          key,
          message: `Expected boolean, got "${rawValue}"`,
        });
        continue;
      }
    }

    // Enum
    if (rules.enum && !rules.enum.includes(value)) {
      issues.push({
        key,
        message: `Value "${value}" is not in enum [${rules.enum.join(', ')}]`,
      });
    }

    // Numeric constraints
    if (typeof value === 'number') {
      if (rules.min !== undefined && value < rules.min) {
        issues.push({
          key,
          message: `Value ${value} is less than min ${rules.min}`,
        });
      }
      if (rules.max !== undefined && value > rules.max) {
        issues.push({
          key,
          message: `Value ${value} is greater than max ${rules.max}`,
        });
      }
    }

    // String constraints
    if (typeof value === 'string') {
      if (rules.minLength !== undefined && value.length < rules.minLength) {
        issues.push({
          key,
          message: `Length ${value.length} is less than minLength ${rules.minLength}`,
        });
      }
      if (rules.maxLength !== undefined && value.length > rules.maxLength) {
        issues.push({
          key,
          message: `Length ${value.length} is greater than maxLength ${rules.maxLength}`,
        });
      }
      if (rules.regex) {
        const re = new RegExp(rules.regex);
        if (!re.test(value)) {
          issues.push({
            key,
            message: `Value "${value}" does not match regex ${rules.regex}`,
          });
        }
      }
    }
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}
