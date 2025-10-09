import ts from "typescript";
import * as acorn from "acorn";

const jsGlobals = {
  window: "readonly",
  document: "readonly",
  navigator: "readonly",
  localStorage: "readonly",
  console: "readonly",
  setTimeout: "readonly",
  clearTimeout: "readonly",
  setInterval: "readonly",
  clearInterval: "readonly",
  requestAnimationFrame: "readonly",
  cancelAnimationFrame: "readonly",
};

function createTypeScriptParser() {
  return {
    parseForESLint(code, parserOptions = {}) {
      const suppliedFilePath =
        typeof parserOptions.filePath === "string"
          ? parserOptions.filePath
          : typeof parserOptions.filename === "string"
            ? parserOptions.filename
            : undefined;
      const isTsx = suppliedFilePath?.endsWith?.(".tsx");

      const transpiled = ts.transpileModule(code, {
        compilerOptions: {
          jsx: isTsx ? ts.JsxEmit.ReactJSX : undefined,
          module: ts.ModuleKind.ESNext,
          target: ts.ScriptTarget.ES2022,
          useDefineForClassFields: true,
        },
        fileName: suppliedFilePath ?? "input.tsx",
      });

      const tokens = [];
      const comments = [];
      const parser = acorn.Parser;
      const ast = parser.parse(transpiled.outputText, {
        ecmaVersion: "latest",
        sourceType: "module",
        allowAwaitOutsideFunction: true,
        allowImportExportEverywhere: true,
        locations: true,
        ranges: true,
        onToken: tokens,
        onComment: comments,
      });

      ast.tokens = tokens;
      ast.comments = comments;

      return {
        ast,
        tokens,
        comments,
      };
    },
  };
}

const tsParser = createTypeScriptParser();

export default [
  {
    ignores: [
      "dist",
      "build",
      "node_modules",
      "coverage",
      "**/*.d.ts",
      "src/stories/**",
    ],
  },
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: jsGlobals,
    },
    rules: {},
  },
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
      globals: jsGlobals,
    },
    rules: {},
  },
];
