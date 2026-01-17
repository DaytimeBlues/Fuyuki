
import fs from 'fs';
import path from 'path';

const filePath = path.join('src', 'data', 'srd-5.2-spells.json');

try {
    const data = fs.readFileSync(filePath, 'utf8');

    // Find the last '}'
    const lastBrace = data.lastIndexOf('}');

    if (lastBrace !== -1) {
        console.log('Found last closing brace at index:', lastBrace);

        // Take everything up to the last brace (inclusive) and add a closing bracket
        const repaired = data.substring(0, lastBrace + 1) + ']';

        try {
            JSON.parse(repaired);
            console.log('Repaired JSON is valid. Writing to file...');
            fs.writeFileSync(filePath, repaired);
            console.log('File repaired successfully.');
        } catch (e) {
            console.error('Repaired JSON is still invalid:', e.message);
            // Debug: print the end of the repaired string
            console.log('Tail of repaired string:', repaired.slice(-100));
        }
    } else {
        console.error('Could not find any "}" in file.');
    }
} catch (err) {
    console.error('Error reading file:', err);
}
