const fs = require("fs");
const { execSync } = require("child_process");

try {
  // Read ComponentGallery.tsx
  const galleryContent = fs.readFileSync("components/ComponentGallery.tsx", "utf8");

  // Extract componentPaths array
  const pathsMatch = galleryContent.match(/const componentPaths = \[([\s\S]*?)\];/);
  if (!pathsMatch) {
    console.log("Could not find componentPaths array");
    process.exit(1);
  }

  const pathsString = pathsMatch[1];
  const paths = pathsString.split(",").map((p) =>
    p
      .trim()
      .replace(/['"]/g, "")
      .replace(/\.\.\//g, "")
  );

  // Get all actual component files
  const componentsOutput = execSync(
    'find components -name "*.tsx" -o -name "*.ts" | grep -v node_modules | grep -v ".bak" | sed "s|^components/||" | sort',
    { encoding: "utf8" }
  );
  const srcComponentsOutput = execSync(
    'find src/components -name "*.tsx" -o -name "*.ts" | grep -v node_modules | grep -v ".bak" | sed "s|^src/components/||" | sort',
    { encoding: "utf8" }
  );

  const componentsFiles = componentsOutput
    .trim()
    .split("\n")
    .filter((f) => f);
  const srcComponentsFiles = srcComponentsOutput
    .trim()
    .split("\n")
    .filter((f) => f);

  console.log("data componentsFiles:", componentsFiles.slice(0, 5));
  console.log("data srcComponentsFiles:", srcComponentsFiles.slice(0, 5));

  // Find required components
  const missingFromGallery = [];
  const allFiles = [...componentsFiles, ...srcComponentsFiles];

  allFiles.forEach((file) => {
    if (!galleryPaths.includes(file) && file !== "ComponentGallery.tsx") {
      missingFromGallery.push(file);
    }
  });

  // Find components in gallery that don't exist
  const notFoundInFilesystem = [];
  galleryPaths.forEach((path) => {
    if (!allFiles.includes(path)) {
      notFoundInFilesystem.push(path);
    }
  });

  console.log("=== required FROM ComponentGallery.tsx ===");
  missingFromGallery.forEach((file) => console.log(file));

  console.log("\n=== IN ComponentGallery.tsx BUT NOT FOUND IN FILESYSTEM ===");
  notFoundInFilesystem.forEach((file) => console.log(file));

  console.log("\n=== SUMMARY ===");
  console.log("Total components in filesystem:", allFiles.length);
  console.log("Total components in ComponentGallery.tsx:", galleryPaths.length);
  console.log("required from gallery:", missingFromGallery.length);
  console.log("Not found in filesystem:", notFoundInFilesystem.length);

  // Write required components to a file for easy reference
  if (missingFromGallery.length > 0) {
    const missingContent = missingFromGallery
      .map((file) => {
        // Determine the correct import path
        let importPath;
        if (componentsFiles.includes(file)) {
          importPath = `../components/${file}`;
        } else if (srcComponentsFiles.includes(file)) {
          importPath = `../../src/components/${file}`;
        } else {
          importPath = `../components/${file}`; // fallback
        }
        return `  "${importPath}",`;
      })
      .join("\n");

    fs.writeFileSync("missing_components.txt", missingContent);
    console.log("\nMissing components list saved to missing_components.txt");
  }
} catch (error) {
  console.error("Error:", error.message);
}
