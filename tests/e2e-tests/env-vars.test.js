require('dotenv').config();

const puppeteer = require('puppeteer');
const path = require('path');

const username = process.env.GMAIL_USERNAME;
const password = process.env.GMAIL_PASSWORD;
const EXTENSION_PATH = path.resolve(__dirname, '..', '..');

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

test('login successfully', async () => {
    if(!username || !password) {
        throw new Error('Username or password not provided');
    }

    const page = await browser.newPage();

  try {
    await page.goto('https://mail.google.com');
    await page.type('[name="identifier"]', username);
    await page.click('#identifierNext');
    await page.waitForSelector('[name="password"]');
    await page.type('[name="password"]', password);
    await page.click('#passwordNext');
    await page.waitForNavigation();
    expect()
    console.log('Logged in successfully');
  } catch (error) {
    console.error('Error logging in:', error);
  } finally {
    await browser.close();
  }
}, 10000);