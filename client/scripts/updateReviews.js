/**
 * Script to update review dates automatically
 * Run this script weekly to keep reviews fresh
 * 
 * Usage: node scripts/updateReviews.js
 */

const fs = require('fs');
const path = require('path');

// Path to reviews data file
const reviewsFilePath = path.join(__dirname, '../src/data/reviewsData.ts');

// Read the file
let fileContent = fs.readFileSync(reviewsFilePath, 'utf8');

// Function to get a random date from the past week
function getRandomDateFromPastWeek() {
    const now = new Date();
    const daysAgo = Math.floor(Math.random() * 7); // 0-6 days ago
    const date = new Date(now);
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().split('T')[0]; // Format: YYYY-MM-DD
}

// Extract all review entries
const reviewMatches = fileContent.match(/{ id: \d+,.*?}/gs);

if (!reviewMatches) {
    console.error('❌ Could not find review entries in the file');
    process.exit(1);
}

console.log(`📊 Found ${reviewMatches.length} reviews`);

// Select 15 random reviews to update
const numberOfReviewsToUpdate = 15;
const reviewsToUpdate = [];

while (reviewsToUpdate.length < numberOfReviewsToUpdate) {
    const randomIndex = Math.floor(Math.random() * reviewMatches.length);
    if (!reviewsToUpdate.includes(randomIndex)) {
        reviewsToUpdate.push(randomIndex);
    }
}

console.log(`🔄 Updating ${numberOfReviewsToUpdate} random reviews with new dates...`);

// Update the selected reviews
let updatedCount = 0;
reviewsToUpdate.forEach(index => {
    const oldReview = reviewMatches[index];
    const newDate = getRandomDateFromPastWeek();

    // Replace the date in the review
    const newReview = oldReview.replace(
        /date: "\d{4}-\d{2}-\d{2}"/,
        `date: "${newDate}"`
    );

    fileContent = fileContent.replace(oldReview, newReview);
    updatedCount++;
});

// Write the updated content back to the file
fs.writeFileSync(reviewsFilePath, fileContent, 'utf8');

console.log(`✅ Successfully updated ${updatedCount} reviews!`);
console.log(`📝 File updated: ${reviewsFilePath}`);
console.log(`\n💡 Tip: Run this script weekly to keep reviews fresh`);
console.log(`   Example cron: 0 0 * * 0 (every Sunday at midnight)`);
