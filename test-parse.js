const pdf = require('pdf-parse');
const fs = require('fs');
const path = require('path');

async function test() {
    console.log('Testing pdf-parse v1.1.1...');
    console.log('pdf type:', typeof pdf);

    // Load the real PDF file
    const pdfPath = path.join(__dirname, 'public', 'devis_ravalement_chalet_yeti.pdf');
    const buffer = fs.readFileSync(pdfPath);

    console.log('Buffer loaded, size:', buffer.length);

    try {
        const data = await pdf(buffer);
        console.log('SUCCESS!');
        console.log('Text (first 500 chars):', data.text?.substring(0, 500));
        console.log('numpages:', data.numpages);
    } catch (e) {
        console.error('Error:', e.message);
    }
}

test();
