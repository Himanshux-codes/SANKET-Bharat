import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTypescript from 'eslint-config-next/typescript'

export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  {
    files: ['tests/**/*.cjs'],
    // Node's built-in test runner and the existing TS loader use CommonJS.
    rules: { '@typescript-eslint/no-require-imports': 'off' },
  },
  globalIgnores([
    '.next/**', 'out/**', 'build/**', 'next-env.d.ts',
    'playwright-report/**', 'test-results/**',
  ]),
])
