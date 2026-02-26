import * as fs from 'fs';
import * as path from 'path';

// We will use ts-node to run this, so we can import the TS file
import { GENRE_PRESETS, GENRE_LABELS } from '../config/presets';

const outputDir = path.join(__dirname, '../config/presets-data');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

for (const [key, preset] of Object.entries(GENRE_PRESETS)) {
  const filePath = path.join(outputDir, `${key}.json`);
  fs.writeFileSync(filePath, JSON.stringify(preset, null, 2));
  console.log(`Extracted ${key}.json`);
}

// Write an index file that only has keys and metadata, not the heavy content
const meta = Object.entries(GENRE_PRESETS).reduce((acc, [key, preset]) => {
  acc[key] = {
    theme: preset.theme,
    colorTheme: preset.colorTheme,
    typographyStyle: preset.typographyStyle,
    activeSections: preset.activeSections,
  };
  return acc;
}, {} as any);

fs.writeFileSync(
  path.join(outputDir, 'meta.json'),
  JSON.stringify(meta, null, 2)
);
console.log('Extracted meta.json');
