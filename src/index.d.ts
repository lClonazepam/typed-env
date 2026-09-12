export type EnvType = 'string' | 'int' | 'float' | 'bool' | 'enum' | 'url';

export interface FieldSpec {
  type: EnvType;
  default?: unknown;
  values?: string[];
  allowEmpty?: boolean;
}

export declare class EnvError extends Error {
  issues: string[];
}

export declare function loadEnv<
  S extends Record<string, FieldSpec>
>(schema: S, source?: NodeJS.ProcessEnv): Record<keyof S, unknown>;
