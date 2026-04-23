#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Simple CSS minifier
function minifyCSS(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
    .replace(/\s+/g, ' ') // Collapse whitespace
    .replace(/\s*([{};:,>+~])\s*/g, '$1') // Remove spaces around symbols
    .trim();
}

// Simple JS minifier (basic)
function minifyJS(js) {
  return js
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
    .replace(/\/\/.*$/gm, '') // Remove line comments
    .replace(/\s+/g, ' ') // Collapse whitespace
    .replace(/\s*([{};:,()])\s*/g, '$1') // Remove spaces around symbols
    .trim();
}

// Ensure directory exists
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Copy files recursively
function copyDir(src, dest) {
  ensureDir(dest);
  const files = fs.readdirSync(src);

  files.forEach(file => {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);
    const stat = fs.statSync(srcPath);

    if (stat.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

console.log('🔨 Building...\n');

const srcDir = path.join(__dirname, 'src');
const distDir = path.join(__dirname, 'dist');

// Clean dist
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true });
}
ensureDir(distDir);

// 1. Copy and minify CSS
console.log('📦 Minifying CSS...');
const cssFiles = ['styles.css', 'portfolio-design.css'];
ensureDir(path.join(distDir, 'css'));

cssFiles.forEach(file => {
  const srcPath = path.join(srcDir, 'css', file);
  const destPath = path.join(distDir, 'css', file.replace('.css', '.min.css'));

  const css = fs.readFileSync(srcPath, 'utf-8');
  const minified = minifyCSS(css);
  fs.writeFileSync(destPath, minified);

  const originalSize = css.length;
  const minifiedSize = minified.length;
  const savings = ((1 - minifiedSize / originalSize) * 100).toFixed(1);

  console.log(`  ✓ ${file} → ${path.basename(destPath)} (${savings}% smaller)`);
});

// 2. Copy and minify JS
console.log('\n📦 Minifying JavaScript...');
ensureDir(path.join(distDir, 'js'));

const srcJS = path.join(srcDir, 'js', 'main.js');
const destJS = path.join(distDir, 'js', 'main.min.js');

const js = fs.readFileSync(srcJS, 'utf-8');
const minifiedJS = minifyJS(js);
fs.writeFileSync(destJS, minifiedJS);

const jsOriginal = js.length;
const jsMinified = minifiedJS.length;
const jsSavings = ((1 - jsMinified / jsOriginal) * 100).toFixed(1);

console.log(`  ✓ main.js → main.min.js (${jsSavings}% smaller)`);

// 3. Copy HTML files and update references
console.log('\n📄 Processing HTML...');
const htmlFiles = ['index.html', 'portfolio-design.html'];

htmlFiles.forEach(file => {
  let html = fs.readFileSync(path.join(srcDir, file), 'utf-8');

  // Update CSS references
  html = html.replace(/href="css\/(\w+)\.css"/g, 'href="css/$1.min.css"');

  // Update JS references
  html = html.replace(/src="js\/main\.js"/g, 'src="js/main.min.js"');

  fs.writeFileSync(path.join(distDir, file), html);
  console.log(`  ✓ ${file}`);
});

// 4. Copy assets
console.log('\n🖼️  Copying assets...');
const assetsDir = path.join(srcDir, 'assets');
if (fs.existsSync(assetsDir)) {
  copyDir(assetsDir, path.join(distDir, 'assets'));
  console.log('  ✓ assets/');
}

// 5. Summary
console.log('\n✅ Build complete!\n');
console.log(`📂 Output: ${distDir}`);
console.log(`   dist/`);
console.log(`   ├── index.html`);
console.log(`   ├── portfolio-design.html`);
console.log(`   ├── css/`);
console.log(`   │  ├── styles.min.css`);
console.log(`   │  └── portfolio-design.min.css`);
console.log(`   ├── js/`);
console.log(`   │  └── main.min.js`);
console.log(`   └── assets/`);
