# typed-env

Fail-fast, type-safe `process.env` parsing with **zero runtime dependencies**.

Bad config should crash at boot, not at 3am in production. This library turns a schema into a typed object and prints every missing/invalid key in one error.

## Usage

```js
import { loadEnv } from 'typed-env';

export const env = loadEnv({
  PORT: { type: 'int', default: 3000 },
  DATABASE_URL: { type: 'string' },
  FEATURE_X: { type: 'bool', default: false },
  NODE_ENV: { type: 'enum', values: ['development', 'test', 'production'] },
});

// env.PORT is a number
// env.FEATURE_X is a boolean
```

## Types

| type | parse rule |
| --- | --- |
| `string` | non-empty unless `allowEmpty` |
| `int` | `Number.parseInt`, finite |
| `float` | `Number.parseFloat`, finite |
| `bool` | `true/1/yes` vs `false/0/no` |
| `enum` | must be in `values` |
| `url` | must parse as `URL` |

## Design notes

- No Zod / no Joi — copy-paste friendly for interview take-homes.
- Aggregates all errors instead of throwing on the first key.
- Defaults are applied only when the key is absent, never when invalid.

## License

MIT
