const fs = require('fs');
const path = require('path');

const walk = function (dir) {
    let results = [];
    try {
        const list = fs.readdirSync(dir);
        list.forEach(function (file) {
            file = path.join(dir, file);
            const stat = fs.statSync(file);
            if (stat && stat.isDirectory()) {
                results = results.concat(walk(file));
            } else {
                if (file.endsWith('.ts') || file.endsWith('.tsx')) {
                    results.push(file);
                }
            }
        });
    } catch (err) { }
    return results;
}

const dirs = [
    'c:/Users/Danrave/Desktop/Project/template-nextjs-nestjs/boilerplate/app',
    'c:/Users/Danrave/Desktop/Project/template-nextjs-nestjs/boilerplate/components'
];

let totalFixed = 0;
dirs.forEach(dir => {
    const files = walk(dir);
    for (const file of files) {
        let content = fs.readFileSync(file, 'utf8');
        const initial = content;
        content = content.replace(/â€¦/g, '...');
        content = content.replace(/â€”/g, '—');
        content = content.replace(/â†‘/g, '↑');
        content = content.replace(/â†“/g, '↓');
        content = content.replace(/â‚±/g, '₱');

        // Quotes
        content = content.replace(/â€™/g, '\'');
        content = content.replace(/â€˜/g, '\'');
        content = content.replace(/â€œ/g, '\"');
        content = content.replace(/â€/g, '\"'); // keep this last as catch-all for remaining quotes

        if (content !== initial) {
            fs.writeFileSync(file, content, 'utf8');
            console.log('Fixed', file);
            totalFixed++;
        }
    }
});
console.log('Total files fixed:', totalFixed);
