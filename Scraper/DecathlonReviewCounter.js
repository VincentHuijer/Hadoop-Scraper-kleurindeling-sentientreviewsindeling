const fs = require("fs");

// Read 'reviews.json' file
const reviewsData = fs.readFileSync("./reviews.json", "utf-8");

// Parse the reviews data to get an array of reviews
const reviews = JSON.parse(reviewsData);

// Count the total number of reviews
const totalReviewCount = reviews.length;

// Count the number of reviews with 100 words or more
let longReviewCount = 0;

reviews.forEach(review => {
  const words = review.split(" ");
  if (words.length >= 100) {
    longReviewCount++;
  }
});

console.log(`Total number of reviews: ${totalReviewCount}`);
console.log(`Number of reviews with 100 words or more: ${longReviewCount}`);
