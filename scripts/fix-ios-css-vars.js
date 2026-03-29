/**
 * Converts hex CSS variable values to space-separated RGB channel format
 * so Tailwind 4's /opacity modifier works on iOS Safari.
 * e.g.  --primary: #1a2b3c;  →  --primary: 27 43 60;
 *
 * Only converts properties that Tailwind uses with /opacity:
 *   --primary, --primary-foreground, --accent, --accent-foreground,
 *   --muted, --muted-foreground, --foreground, --background,
 *   --secondary, --secondary-foreground, --card, --card-foreground,
 *   --popover, --popover-foreground, --border, --destructive,
 *   --destructive-foreground, --info, --success, --warning
 *
 * rgba() border values are left as-is (they already work on iOS).
 */
const fs = require('fs');
const path = require('path');

function hexToRgbChannels(hex) {
  hex = hex.replace('#', '');
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return `${r} ${g} ${b}`;
}

// CSS properties to convert (these are used with Tailwind /opacity modifiers)
const TARGET_PROPS = new Set([
  '--primary', '--primary-foreground',
  '--accent', '--accent-foreground',
  '--muted', '--muted-foreground',
  '--foreground', '--background',
  '--secondary', '--secondary-foreground',
  '--card', '--card-foreground',
  '--popover', '--popover-foreground',
  '--destructive', '--destructive-foreground',
  '--info', '--info-foreground',
  '--success', '--success-foreground',
  '--warning', '--warning-foreground',
]);

function convertFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let count = 0;

  // Match lines like:   --primary: #rrggbb;
  content = content.replace(
    /([ \t]*)(--[\w-]+)(\s*:\s*)(#[0-9a-fA-F]{3,6})(;)/g,
    (match, indent, prop, colon, hex, semi) => {
      if (!TARGET_PROPS.has(prop)) return match;
      const rgb = hexToRgbChannels(hex);
      count++;
      return `${indent}${prop}${colon}${rgb}${semi}`;
    }
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`  Converted ${count} values in ${path.basename(filePath)}`);
}

const root = path.join(__dirname, '..');
convertFile(path.join(root, 'app', 'globals.css'));
convertFile(path.join(root, 'app', 'themes.css'));
console.log('Done. All hex CSS variables converted to RGB channel format.');
