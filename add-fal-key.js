const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
const falKey = "24eb7b35-b3ca-4071-a06c-0d382168d43d:f84adab7bad02d5687b0d4fb732c08f6";

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
