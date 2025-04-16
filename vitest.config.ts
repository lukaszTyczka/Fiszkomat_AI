import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react"; // Assuming you might use React components directly or via Astro islands

export default defineConfig({
  plugins: [react()], // Add necessary plugins, e.g., for React/Astro integration if needed
  test: {
    globals: true, // Use global APIs like describe, it, expect
    environment: "jsdom", // Simulate DOM environment for UI testing
    setupFiles: ["./src/tests/setup.ts"], // Path to setup file for global mocks, etc.
    include: ["src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"], // Pattern for test files
    coverage: {
      provider: "v8", // or 'istanbul'
      reporter: ["text", "json", "html"],
      // thresholds: { // Example thresholds - uncomment and adjust as needed
      //   lines: 80,
      //   functions: 80,
      //   branches: 80,
      //   statements: 80,
      // },
    },
  },
  // Configuration for Vitest UI - moved to top level
  // ui: {
  //   // specify options for Vitest UI, e.g.
  //   // api: true, // default
  //   // port: 51204, // default
  //   // open: true, // default
  // },
});
