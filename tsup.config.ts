import { defineConfig } from "tsup";

export default defineConfig({
  format: ["cjs", "esm"],
  entry: ["./src/index.ts"],
  dts: true,
  loader: {
    ".txt": "text", // inline .txt as string
  },
  shims: true,
  skipNodeModulesBundle: true,
  clean: true,
});
