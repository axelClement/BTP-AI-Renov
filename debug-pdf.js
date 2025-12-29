const pdf = require('pdf-parse');
console.log('Is pdf a function?', typeof pdf === 'function');
if (typeof pdf === 'object') {
    console.log('pdf.PDFParse type:', typeof pdf.PDFParse);
    console.log('pdf.default type:', typeof pdf.default);
    // inspect keys again
    console.log('Keys:', Object.keys(pdf));
}


