/**
 *  Puppeteer test script for testing popup rendering.
 * 
 * @credits OpenAI ChatGPT
 */

const puppeteer = require('puppeteer');
const path = require('path');

const EXTENSION_PATH = path.resolve(__dirname, '..', '..');
const EXTENSION_ID = 'bepbhcdlapfchobedkdknekjkanefamc';

let browser;

beforeEach(async () => {
    browser = await puppeteer.launch({
      headless: false,
      args: [
        `--disable-extensions-except=${EXTENSION_PATH}`,
        `--load-extension=${EXTENSION_PATH}`
      ]
    });
  });
  
  afterEach(async () => {
    await browser.close();
    browser = undefined;
  });

  test('popup renders correctly2', async () => {
    const page = await browser.newPage();
    await page.goto(`chrome-extension://${EXTENSION_ID}/popup/popup.html`);

    // Check if the popup HTML file loads successfully
    const title = await page.title();
    expect(title).toBe('Popup');

    // Check if the image is present in the popup
    const image = await page.$('img');
    expect(image).not.toBeNull();

    // Optionally, check the alt text of the image
    const altText = await page.evaluate(() => {
        const img = document.querySelector('img');
        return img ? img.alt : null;
    });
    expect(altText).toBe('logo');
  });