import typescript from "@rollup/plugin-typescript";
import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
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
  plugins: [resolve(), typescript(), babel({ babelHelpers: "bundled" })],
  external: ["react", "react-dom"],
};
