const puppeteer = require("puppeteer");
const fs = require("fs");

const urls = [
  "https://www.amazon.nl/s?k=sportschoenen&page=",
  "https://www.amazon.nl/s?k=sneakers&page=",
];

let index = 1;

const filteredImages = new Set();

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  for (let urlnumber = 0; urlnumber < urls.length; urlnumber++) {
    const currenturl = urls[urlnumber];
    const getPageUrl = (index) => `${currenturl}${index}`;
    index = 1;

    while (index < 8) {
      await page.goto(getPageUrl(index));
      if (index === 1 && urlnumber === 0) {
        const cookiebutton = await page.$x('//*[@id="sp-cc-accept"]');
        await cookiebutton[0].click();
      }
      const images = await page.$$("img");
      for (let image of images) {
        let src = await image.getProperty("src");
        let srcValue = await src.jsonValue();
        if (srcValue.includes(".jpg" || ".png" || ".jpeg")) {
          filteredImages.add(srcValue);
        }
      }

      // Check if filteredImages Set is empty, if so, break out of the loop
      if (filteredImages.size === 0) {
        break;
      }

      index++;
    }
  }

  await browser.close();

  const links = Array.from(filteredImages);
  writeLinksToJson(links);
})();

function writeLinksToJson(links) {
  const linksJSON = JSON.stringify(links);
  fs.writeFile("AmazonImages.json", linksJSON, (err) => {
    if (err) throw err;
  });
  console.log(filteredImages.size);

}
