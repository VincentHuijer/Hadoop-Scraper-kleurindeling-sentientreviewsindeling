const fs = require("fs");
const puppeteer = require('puppeteer');

(async () => {
    // Read links from links.json file
    const links = JSON.parse(fs.readFileSync("./links.json"));

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    const reviews = [];
    let reviewCount = 0;
    let longReviewsCount = 0;

    for (let link of links) {
        await page.goto(link);

        try {
            // Wait for the review section to load with a maximum timeout of 5 seconds
            await page.waitForSelector('.answer-body', { timeout: 2000 });

            // Extract the review text
            const reviewText = await page.evaluate(() => {
                const reviewElement = document.querySelector('.answer-body');
                if (reviewElement) {
                    return reviewElement.textContent;
                } else {
                    return null;
                }
            });

            console.log('Review:', reviewText);

            // Add review text to reviews array
            reviews.push(reviewText);
            reviewCount++;

            // Check for next pages and extract reviews
            let nextPage = await page.$('.Reach review page n°2');
            let nextPageNumber = 3;
            while (nextPageNumber <= 30 && nextPage) {
                await Promise.all([
                    page.waitForNavigation(),
                    nextPage.click()
                ]);
                await page.waitForSelector('.answer-body', { timeout: 2000 });
                const reviewTextNextPage = await page.evaluate(() => {
                    const reviewElement = document.querySelector('.answer-body');
                    if (reviewElement) {
                        return reviewElement.textContent;
                    } else {
                        return null;
                    }
                });
                console.log(`Review from page ${nextPageNumber}:`, reviewTextNextPage);
                reviews.push(reviewTextNextPage);
                reviewCount++;
                nextPageNumber++;
                nextPage = await page.$(`.Reach review page n°${nextPageNumber}`);
            }
        } catch (error) {
            console.log(`No review found for link: ${link}`);
        }
    }

    // Calculate count of reviews with 100 words or more
    for (let review of reviews) {
        if (review && review.split(" ").length >= 100) {
            longReviewsCount++;
        }
    }

    console.log(`Total Reviews: ${reviewCount}`);
    console.log(`Reviews with 100 words or more: ${longReviewsCount}`);

    // Save reviews in a JSON file
    fs.writeFileSync("ReviewsDecathlon.json", JSON.stringify(reviews));

    await browser.close();
})();
