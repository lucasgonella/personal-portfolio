import js from '@eslint/js'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist/**', '.deploy/**', '.tools/**', 'node_modules/**'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  { languageOptions: { globals: { console: 'readonly', process: 'readonly', fetch: 'readonly', URL: 'readonly', setTimeout: 'readonly', Buffer: 'readonly', document: 'readonly', getComputedStyle: 'readonly' } } },
)
