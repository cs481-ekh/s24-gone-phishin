const process = require("../../js/process-content");

//Test if can recognize HTML
test('Test if HTML is recognized', () => {
    expect(process.isHTML("<div>Hello <b>world</b>!</div>")).toBe(true);
});

//Test if can recongnize plaintext
test('Test if plaintext is recognized', () => {
    expect(process.isHTML("Hello world!")).toBe(false);
});

//Check for false html positives
test('For false positive HTML', () => {
    expect(process.isHTML("three is < four")).toBe(false);
});

//Check if extract extracts correctly
test('Test if HTML is extracted correctly', () => {
    expect(process.extractTextFromHTML("<div>Hello <b>world</b>!</div>")).toEqual("Hello world!");
});

//Check if normalize normalizes correctly
test('Test if trailing whitespace is removed', () => {
    expect(process.normalizeText("        Hello world!      ")).toEqual("Hello world!");
});