// Vitest setup file
// You can add global setup code here, like:
// - Mocking global objects (e.g., fetch)
// - Setting up testing utilities
// - Importing custom matchers

import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
// import matchers from '@testing-library/jest-dom/matchers'; // Optional: if you need jest-dom matchers

// Optional: extends Vitest's expect method with methods from jest-dom
// import { expect } from 'vitest'; // Import expect here if extending
// expect.extend(matchers);

// Runs a cleanup after each test case (e.g., clearing jsdom)
afterEach(() => {
  cleanup();
});

console.log("Vitest setup file loaded.");
