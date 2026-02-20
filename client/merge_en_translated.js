const fs = require('fs');
const path = require('path');

const enPath = path.join(__dirname, 'messages', 'en.json');
const translatedPath = path.join(__dirname, 'en_items_full_translated.json');

try {
    const enContent = JSON.parse(fs.readFileSync(enPath, 'utf8'));
    const translatedItems = JSON.parse(fs.readFileSync(translatedPath, 'utf8'));

    if (enContent.Reviews && enContent.Reviews.Items) {
        enContent.Reviews.Items = translatedItems;
        fs.writeFileSync(enPath, JSON.stringify(enContent, null, 2));
        console.log('en.json updated successfully with 110 translated reviews.');
    } else {
        console.error('Reviews.Items structure not found in en.json');
    }
} catch (error) {
    console.error('Error during merge:', error.message);
}
