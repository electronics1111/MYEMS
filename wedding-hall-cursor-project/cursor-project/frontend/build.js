// ═══════════════════════════════════════════════════════════════════════
//  BUILD SCRIPT
//  Bundles src/app.jsx + dependencies into a single self-contained HTML file.
//
//  Usage:
//    npm run build       # one-time build
//    npm run dev         # rebuilds automatically on file changes
// ═══════════════════════════════════════════════════════════════════════

const esbuild = require("esbuild");
const fs = require("fs");
const path = require("path");

const isWatch = process.argv.includes("--watch");
const API_BASE_URL = process.env.API_BASE_URL || "";

// Entry file content (creates the React root)
const entrySource = `
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./app.jsx";

const root = createRoot(document.getElementById("root"));
root.render(React.createElement(App));
`;

// Write the entry file to a temp location
const ENTRY_PATH = path.join(__dirname, "src", "_entry.jsx");
fs.writeFileSync(ENTRY_PATH, entrySource);

const buildOptions = {
  entryPoints: [ENTRY_PATH],
  bundle: true,
  format: "iife",
  jsx: "automatic",
  loader: { ".jsx": "jsx" },
  minify: true,
  target: "es2020",
  define: {
    "process.env.NODE_ENV": '"production"',
    "process.env.API_BASE_URL": JSON.stringify(API_BASE_URL),
  },
  outfile: path.join(__dirname, "dist", "bundle.js"),
};

async function buildOnce() {
  // Ensure dist/ exists
  const distDir = path.join(__dirname, "dist");
  if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true });

  await esbuild.build(buildOptions);

  const bundle = fs.readFileSync(path.join(__dirname, "dist", "bundle.js"), "utf-8");
  const htmlTemplate = fs.readFileSync(path.join(__dirname, "index.html"), "utf-8");

  // Replace placeholder with inlined bundle
  const finalHtml = htmlTemplate.replace("<!-- BUNDLE_PLACEHOLDER -->", `<script>${bundle}</script>`);

  const outPath = path.join(__dirname, "dist", "wedding-hall-management.html");
  fs.writeFileSync(outPath, finalHtml);

  const sizeKb = (fs.statSync(outPath).size / 1024).toFixed(1);
  console.log(`✓ Built: dist/wedding-hall-management.html (${sizeKb} KB)`);
}

async function buildWatch() {
  const ctx = await esbuild.context(buildOptions);
  await ctx.watch();
  console.log("✓ Watching for changes... (Ctrl+C to stop)");

  // Re-bundle HTML on any file change
  fs.watch(path.join(__dirname, "src"), { recursive: true }, async () => {
    try {
      await buildOnce();
    } catch (err) {
      console.error("Build error:", err.message);
    }
  });
  fs.watch(path.join(__dirname, "index.html"), async () => {
    try { await buildOnce(); } catch (err) { console.error(err.message); }
  });

  // Initial build
  await buildOnce();
}

(async () => {
  try {
    if (isWatch) {
      await buildWatch();
    } else {
      await buildOnce();
      console.log("");
      console.log("Open the file in your browser:");
      console.log("  open dist/wedding-hall-management.html   (macOS)");
      console.log("  xdg-open dist/wedding-hall-management.html   (Linux)");
      console.log("  start dist/wedding-hall-management.html  (Windows)");
      console.log("");
      console.log("Or run a dev server:  npm run serve");
    }
  } catch (err) {
    console.error("✗ Build failed:", err);
    process.exit(1);
  }
})();
