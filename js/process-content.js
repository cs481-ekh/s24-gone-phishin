function processContent(content) {
    let text = '';

    if (isHTML(content)) {
        // If it's HTML, extract text content
        text = extractTextFromHTML(content);
    } else {
        // If it's plaintext, use it directly
        text = content;
    }

    // Normalize content if needed
    text = normalizeText(text);

    return text;
}

function isHTML(content) {
    // Simple check to see if content contains HTML tags
    return /<[^>]*>/g.test(content);
}

function extractTextFromHTML(htmlContent) {
    // Use DOMParser to parse HTML and extract text content
    const doc = new DOMParser().parseFromString(htmlContent, 'text/html');
    return doc.body.textContent || "";
}

function normalizeText(text) {
    // Normalize text by removing extra whitespace
    return text.trim().replace(/\s+/g, ' ');
}
