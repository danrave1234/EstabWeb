const fs = require('fs');

const registryStr = fs.readFileSync('lib/utils/block-registry.ts', 'utf8');
const previewStr = fs.readFileSync('components/dashboard/ClientDashboardPreview.tsx', 'utf8');

// Match the Map block
const regexMap = /const DEFAULT_SECTION_DATA_MAP: Record<string, any> = \{([\s\S]*?)\}/;
const mapMatch = previewStr.match(regexMap);
if (!mapMatch) {
    console.log('Could not find DEFAULT_SECTION_DATA_MAP');
    process.exit(1);
}

const mapContent = mapMatch[1];
const keyMatches = [...mapContent.matchAll(/'([^']+)'\s*:/g)];
const mappedKeys = new Set(keyMatches.map(m => m[1]));

const idMatches = [...registryStr.matchAll(/id:\s*"([^"]+)"/g)];
const registryIds = new Set(idMatches.map(m => m[1]));

const missing = [];
for (const id of registryIds) {
    if (!mappedKeys.has(id)) {
        missing.push(id);
    }
}

if (missing.length === 0) {
    console.log('All IDs are mapped!');
} else {
    console.log('Missing IDs from Map:\n', missing.join('\n'));
}
