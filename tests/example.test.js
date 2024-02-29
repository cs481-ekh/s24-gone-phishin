// This test is an example on how to format future tests
// imported fuctions go at the top, for example if a sum function existed:
// const sum = require('./sum')

// The test itself 
test('description of test', () => {
    expect(1 + 2).toBe(3); // typicaly the expect contains some function call:
    // expect(sum(1, 2)).toBe(3)
});