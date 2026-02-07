import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  // 1️⃣ Base JS rules
  js.configs.recommended,

  // 2️⃣ Browser + Node globals (Next.js)
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      'no-undef': 'off',
    },
  },

  // 3️⃣ TypeScript files only (type-aware)
  ...tseslint.configs.recommendedTypeChecked.map((config) => ({
    ...config,
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ...config.languageOptions,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',

      // React / Next.js
      'react/react-in-jsx-scope': 'off',
      'no-undef': 'off',
    },
  })),

  // 4️⃣ Ignore generated files
  {
    ignores: ['node_modules/', '.next/', 'dist/', 'build/', 'components/ui/**'],
  },
];
