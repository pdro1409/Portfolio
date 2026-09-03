// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  site: "https://devpdro.com.br",

  // Português é o padrão e não recebe prefixo: / é PT, /en é inglês.
  i18n: {
    locales: ["pt", "en"],
    defaultLocale: "pt",
    routing: {
      prefixDefaultLocale: false,
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [react()],
});
