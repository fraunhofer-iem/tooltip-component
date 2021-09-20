import typescript from "@rollup/plugin-typescript";
import babel from "@rollup/plugin-babel";
import external from "rollup-plugin-peer-deps-external";
import resolve from "@rollup/plugin-node-resolve";
import { DEFAULT_EXTENSIONS } from "@babel/core";
import pkg from "./package.json";

export default {
  input: "src/index.ts",
  output: [
    {
      dir: "dist",
      strict: false,
      exports: "named",
      sourcemap: true,
      format: "cjs",
    },
  ],
  plugins: [
    external(),
    resolve({
      browser: true,
      resolveOnly: [/^(?!react$)/, /^(?!react-dom$)/],
    }),
    typescript(),
    babel({
      presets: [
        "@babel/preset-env",
        "@babel/preset-typescript",
        "@babel/preset-react",
      ],
      babelHelpers: "bundled",
      exclude: "node_modules/**",
      extensions: [...DEFAULT_EXTENSIONS, ".ts", ".tsx"],
    }),
  ],
  external: ["react", "react-dom", "@tippyjs/react"],
};
