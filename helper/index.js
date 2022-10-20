let sanitizeHtml = require("sanitize-html");

let sanitize = (content) => {
    let sanitizedContent = sanitizeHtml(content, {
        allowedAttributes: [],
        allowedTags: []
    });
    return sanitizedContent;
}

module.exports = { sanitize };