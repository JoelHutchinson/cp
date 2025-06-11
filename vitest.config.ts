import { defineVitestConfig } from "@nuxt/test-utils/config";
import { resolve } from "node:path";

export default defineVitestConfig({
  test: {
    environment: "nuxt",
    alias: {
      "#supabase/server": resolve(__dirname, "./test/mocks/supabase.server.ts"),
    },
  },
});
