const puppeteer = require('puppeteer');
const fs = require("fs");

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('https://www.bol.com/nl/nl/p/skechers-uno-dames-sneakers-zwart-maat-40/9200000104770008/?bltgh=sO-01VY-K8MuCX8bChdOWw.2_18.45.ProductTitle');

    // Accept cookies
    await page.waitForSelector('#js-first-screen-accept-all-button');
    await page.click('#js-first-screen-accept-all-button');

    // Click "Toon meer" button to load more reviews
    await page.evaluate(() => {
        document.querySelector('#show-more-reviews').click();
    });

    // Wait for reviews to load
    await page.waitForSelector('[data-test="review-body"]');

    // Extract reviews
    const reviews = await page.evaluate(() => {
        const reviewElements = document.querySelectorAll('[data-test="review-body"]');
        const reviews = [];
        for (const element of reviewElements) {
            reviews.push(element.innerText);
        }
        return reviews;
    });

    // Print reviews in console
    console.log("Reviews:");
    console.log(reviews);

    // Save reviews in JSON file
    fs.writeFileSync("BolReviews.json", JSON.stringify(reviews));

    console.log("Reviews saved to reviews.json. Press any key to exit.");
    await page.waitForTimeout(5000); // Wait for 5 seconds for user input
    await browser.close();
})();
