import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "."),
      // Next's server-only / client-only guards throw outside the bundler;
      // stub them so server modules are importable under Vitest.
      "server-only": resolve(__dirname, "test/stubs/empty.ts"),
      "client-only": resolve(__dirname, "test/stubs/empty.ts"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["test/**/*.test.{ts,tsx}"],
  },
});
