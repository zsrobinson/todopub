// @ts-check
import { defineConfig, envField } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import react from "@astrojs/react";

import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
  output: "server",

  env: {
    schema: {
      SECRET: envField.string({ context: "server", access: "secret" }),
    },
    validateSecrets: true,
  },

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [react()],
  adapter: vercel(),
});