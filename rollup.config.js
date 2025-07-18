import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { string } from "rollup-plugin-string";
import { terser } from "rollup-plugin-terser";
import babel from "rollup-plugin-babel";

// Pull in your package metadata
import pkg from "./package.json";

const banner = `/*!
 * ${pkg.name} v${pkg.version}
 * URLs ${pkg.url}
 * (c) ${new Date().getFullYear()} ${pkg.author}
 * Released under the ${pkg.license} License.
 */`;

export default {
  input: "src/index.js",
  output: {
    file: "dist/coolalert.js",
    format: "umd",
    name: "CoolAlert",
    exports: "default",
    sourcemap: false,
    banner,             
  },
  plugins: [
    resolve(),
    commonjs(),
    string({ include: "**/*.css" }),
    babel({
      exclude: "node_modules/**",
      presets: ["@babel/preset-env"],
    }),
    terser(),
  ],
};
