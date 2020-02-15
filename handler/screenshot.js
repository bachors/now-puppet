import puppeteer from 'puppeteer';

// Replace puppeteer.launch with puppeteer.connect
const browser = await puppeteer.connect({
  browserWSEndpoint: 'wss://chrome.browserless.io'
});

// The rest of your script remains the same
const page = await browser.newPage();
await page.goto('http://bachors.com/');
await page.screenshot({ path: 'screenshot.png' });
page.close();
