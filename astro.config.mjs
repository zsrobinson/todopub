// @ts-check
import { defineConfig, envField } from "astro/config";

// https://astro.build/config
export default defineConfig({
  output: "server",
  env: {
    schema: {
      SECRET: envField.string({ context: "server", access: "secret" }),
    },
    validateSecrets: true,
  },
});
