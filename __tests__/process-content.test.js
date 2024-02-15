import {processContent, isHTML, extractTextFromHTML, normalizeText} from './js/process-content.js';

//Test if can recognize HTML
test('Test if HTML is recognized', () => {
    expect(isHTML("<div>Hello <b>world</b>!</div>")).toBe(true);
});

//Test if can recongnize plaintext
test('Test if plaintext is recognized', () => {
    expect(isHTML("Hello world!")).toBe(false);
});

//Check for false html positives
test('For false positive HTML', () => {
    expect(isHTML("three is < four")).toBe(false);
});

//Check if extract extracts correctly
test('Test if HTML is extracted correctly', () => {
    expect(extractTextFromHTML("<div>Hello <b>world</b>!</div>")).toEqual("Hello world!");
});

//Check if normalize normalizes correctly
test('Test if trailing whitespace is removed', () => {
    expect(extractTextFromHTML("        Hello world!      ")).toEqual("Hello world!");
});