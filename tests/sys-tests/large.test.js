// const { describe, it } = require('@jest/globals');
// const puppeteer = require('puppeteer');
// const path = require('path');

// describe('Email Scanning Speed Test', () => {
//   let browser;
//   let page;

//   // Define extension path
//   const EXTENSION_PATH = path.resolve(__dirname, '..', '..');

//   beforeAll(async () => {
//     // Launch Puppeteer with extension
//     browser = await puppeteer.launch({
//       headless: false, // Set to true for headless mode
//       args: [
//         `--disable-extensions-except=${EXTENSION_PATH}`,
//         `--load-extension=${EXTENSION_PATH}`
//       ]
//     });
//     // Create a new page
//     page = await browser.newPage();
//   });

//   afterAll(async () => {
//     // Close the browser after tests
//     await browser.close();
//   });

//   test('Email Scanning Speed', async () => {
//     // Load the Gmail page or any page where the tab button is present
//     await page.goto('https://mail.google.com/mail/u/0/#inbox/QgrcJHsTjVtjDFMsQRLRtTXLmWpZPXfRmtl');
  
//     const form = await page.$('a#sidebarButton');
//   await form.evaluate( form => form.click() );
  
//     // Measure the time before initiating the email scanning process
//     const startTime = Date.now();
  
//     // Wait for the email scanning process to complete
//     await page.waitForFunction('document.querySelector("#scoreBodyDiv").textContent !== ""', { timeout: 10000 });
  
//     // Measure the time after the email scanning process completes
//     const endTime = Date.now();
  
//     // Calculate and log the time taken for the email scanning process
//     const scanningTime = endTime - startTime;
//     console.log(`Email scanning process completed in ${scanningTime} ms`);
//   }, 15000); // Set the timeout to 15 seconds
// });
