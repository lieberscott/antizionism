/**
 * Conversion script: JS modules --> JSON folder structure
 *
 * Requirements:
 * - Old files: tweets/tweets_X_categoryName/*.js
 * - Each JS file exports: { claimN, examplesN }
 *
 * Output structure:
 * tweets/tweets_X_categoryName/N_slug/claim.json
 * tweets/tweets_X_categoryName/N_slug/examples.json
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, "tweets");

function isJsFile(file) {
  return file.endsWith(".js");
}

function extractNumberAndSlug(filename) {
  // example: "3_languageOfCompassion.js"
  const base = filename.replace(".js", "");
  const parts = base.split("_");
  const number = parts[0]; // "3"
  const slug = parts.slice(1).join("_"); // "languageOfCompassion"
  return { number, slug };
}

(async function convert() {
  console.log("Starting conversion...\n");

  const categories = fs.readdirSync(ROOT).filter(dir => dir.startsWith("tweets_"));

  for (const category of categories) {
    const categoryPath = path.join(ROOT, category);
    const files = fs.readdirSync(categoryPath).filter(isJsFile);

    console.log(`Processing category: ${category}`);

    for (const file of files) {
      const { number, slug } = extractNumberAndSlug(file);

      const inputPath = path.join(categoryPath, file);
      console.log(`  → Converting ${file}`);

      // Import the JS module dynamically
      const moduleExports = require(inputPath);

      // Example: claim3, examples3
      const claimKey = Object.keys(moduleExports).find(k => k.startsWith("claim"));
      const examplesKey = Object.keys(moduleExports).find(k => k.startsWith("examples"));

      if (!claimKey || !examplesKey) {
        console.error(`    ⚠️ Missing expected exports in ${file}, skipping...`);
        continue;
      }

      const claimData = moduleExports[claimKey];
      const examplesData = moduleExports[examplesKey];

      // Output directory: tweets/category/N_slug/
      const outputDir = path.join(categoryPath, `${number}_${slug}`);
      if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

      // Write claim.json
      fs.writeFileSync(
        path.join(outputDir, "claim.json"),
        JSON.stringify(claimData, null, 2),
        "utf8"
      );

      // Write examples.json
      fs.writeFileSync(
        path.join(outputDir, "examples.json"),
        JSON.stringify(examplesData, null, 2),
        "utf8"
      );

      console.log(`    ✔ Wrote claim.json & examples.json`);
    }
  }

  console.log("\nConversion completed!");
})();
