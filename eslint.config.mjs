import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: false },
      ],
      "@typescript-eslint/no-explicit-any": "off",
      "no-extra-boolean-cast": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "prefer-const": "off",
      "react-refresh/only-export-components": "off",
      //'no-debugger': 'off',
      //'@typescript-eslint/no-non-null-asserted-optional-chain': 'error', // Disallow non-null assertions on optional chaining
    },
  },
];

export default eslintConfig;
