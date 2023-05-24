const url = "https://www.decathlon.nl/browse/c0-sporten/c1-wandelen/c2-wandelschoenen/_/N-1wogzce";
const puppeteer = require('puppeteer');
const fs = require("fs");

(async () => {
    let links = []
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(url);

    const elements = await page.$x('//*[@id="didomi-notice-agree-button"]')
    await elements[0].click()

    let canScrape = 25 //bruh
    let index = 2

    while (canScrape) {
        try {
            const card = await page.$x(`//*[@id="app"]/main/div[2]/section[2]/div[1]/div[${index}]/div[3]/a[1]`)

            let href = await (await card[0].getProperty("href")).jsonValue()

            // Replace "/p/" with "/r/"
            href = href.replace("/p/", "/r/");

            // console.log(href);
            links.push(href)
            index++
        } catch {

            //switch page
            try {
                let nextButton = await page.$x(`//*[@id="app"]/main/div[2]/section[2]/nav[2]/button[2]`)

                try {
                    await nextButton[0].click()
                } catch {
                    index = 2
                }

                setTimeout(() => {

                }, 2000);
            } catch {
                index = 0
                canScrape = false
            }
        }
    }

    fs.writeFileSync("./Decathlonlinks.json", JSON.stringify(links))

    
    await browser.close()
    
})();
