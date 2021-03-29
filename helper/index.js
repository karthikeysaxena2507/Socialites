const sanitizeHtml = require("sanitize-html");

const sanitize = (content) => {
    const sanitizedContent = sanitizeHtml(content, {
        allowedAttributes: [],
        allowedTags: []
    });
    return sanitizedContent;
}

module.exports = { sanitize };