const fs = require('fs');
const path = require('path');

const falKey = process.argv[2];

if (!falKey) {
    console.error("Error: Please provide your FAL_KEY as an argument.");
    console.error("Usage: node add-fal-key.js <your-fal-key>");
    process.exit(1);
}

const envPath = path.join(__dirname, '.env');

let content = '';
if (fs.existsSync(envPath)) {
    content = fs.readFileSync(envPath, 'utf8');
}

if (!content.includes('FAL_KEY=')) {
    fs.appendFileSync(envPath, `\nFAL_KEY=${falKey}\n`);
    console.log("FAL_KEY added to .env");
} else {
    const updated = content.replace(/FAL_KEY=.*/, `FAL_KEY=${falKey}`);
    fs.writeFileSync(envPath, updated);
    console.log("FAL_KEY updated in .env");
}
