const fs = require('fs');
const html = fs.readFileSync('page.html', 'utf8');

const regex = /d8um25gjecm9v\.cloudfront\.net[a-zA-Z0-9_\-\.\/\\]+/g;
const matches = html.match(regex) || [];

const clean = matches.map(m => m.replace(/\\/g, '')).filter(m => m.includes('.png') || m.includes('.webp') || m.includes('.jpg'));

console.log([...new Set(clean)].join('\n'));
