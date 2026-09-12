const TRUTHY = new Set(['true', '1', 'yes', 'on']);
const FALSY = new Set(['false', '0', 'no', 'off']);

export class EnvError extends Error {
  constructor(issues) {
    super('Invalid environment:\n' + issues.map((i) => '  - ' + i).join('\n'));
    this.name = 'EnvError';
    this.issues = issues;
  }
}

/**
 * @param {Record<string, any>} schema
 * @param {NodeJS.ProcessEnv} [source]
 */
export function loadEnv(schema, source = process.env) {
  const out = {};
  const issues = [];

  for (const [key, spec] of Object.entries(schema)) {
    const raw = source[key];
    const present = raw !== undefined;
    if (!present) {
      if ('default' in spec) {
        out[key] = spec.default;
        continue;
      }
      issues.push(`${key} is required`);
      continue;
    }
    try {
      out[key] = parseValue(key, raw, spec);
    } catch (e) {
      issues.push(e.message);
    }
  }

  if (issues.length) throw new EnvError(issues);
  return out;
}

function parseValue(key, raw, spec) {
  switch (spec.type) {
    case 'string':
      if (!raw && !spec.allowEmpty) throw new Error(`${key} must not be empty`);
      return raw;
    case 'int': {
      const n = Number.parseInt(raw, 10);
      if (!Number.isFinite(n) || String(n) !== String(parseInt(raw, 10))) {
        throw new Error(`${key} must be an integer (got ${JSON.stringify(raw)})`);
      }
      return n;
    }
    case 'float': {
      const n = Number.parseFloat(raw);
      if (!Number.isFinite(n)) throw new Error(`${key} must be a number`);
      return n;
    }
    case 'bool': {
      const v = raw.toLowerCase();
      if (TRUTHY.has(v)) return true;
      if (FALSY.has(v)) return false;
      throw new Error(`${key} must be a boolean`);
    }
    case 'enum': {
      if (!spec.values?.includes(raw)) {
        throw new Error(`${key} must be one of ${spec.values.join(', ')}`);
      }
      return raw;
    }
    case 'url': {
      try {
        return new URL(raw).toString();
      } catch {
        throw new Error(`${key} must be a valid URL`);
      }
    }
    default:
      throw new Error(`${key} has unknown type ${spec.type}`);
  }
}
