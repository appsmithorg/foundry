export default {
    /**
     * This module provides functionality to parse JSDoc comments from JavaScript code.
     * @module JSDocLite
     */

    /**
     * An object of regex to help identify entries for documentation (functions, constants, and modules).
     * @constant {object} entryRegex
     */
    entryRegex: {
        'function': /@(function|func|method)\s+([a-zA-Z_$][0-9a-zA-Z_$]*)/gm,
        'constant': /@(const|constant|property)\s+{(\w+)}\s+([a-zA-Z_$][0-9a-zA-Z_$]*)/gm,
        'module': /@(module|class)\s+([a-zA-Z_$][0-9a-zA-Z_$]*)/gm
    },

    /**
     * An object of regex to help identify tags for identified entries.
     * @constant {object} tagRegex
     */
    tagRegex: {
        'params': /@(param|arg|argument)\s+{([\s\S]*?)}\s+([a-zA-Z_$][0-9a-zA-Z_$]*)\s*-([\s\S]*?)(?=@|$)/g,
		'returns': /@returns\s+{([\s\S]*?)}\s+([\s\S]*?)(?=@|$)/g,
        'async': /@async/g,
        'example': /@example\s+([\s\S]*?)(?=@|$)/g,
        'see': /@(see|link|doc)\s+([\s\S]*?)(?=@|$)/g
    },

    /**
     * Regex to help identify JS Doc blocks in code.
     * @constant {object} jsdocRegex
     */
    jsdocRegex: /\/\*\*([\s\S]*?)\*\//g,

    /**
     * Asynchronously fetches JavaScript content from a URL and parses the JSDoc comments.
     * @function parseFromUrl
     * @param {string} url - The URL to fetch the JavaScript content from.
     * @returns {Promise<object>} An object containing the parsed JSDoc comments.
     * @async
     */
    async parseFromUrl(url) {
        const code = await this.fetchJsContent(url);
        return this.parse(code);
    },

    /**
     * Parses the provided JavaScript code to extract JSDoc comments.
     * @function parse
     * @param {string} code - The JavaScript code to parse.
     * @returns {object} An object containing the parsed JSDoc comments.
     */
    parse(code) {
        // Go through the code and identify the comment blocks.
        const jsdocComments = code.match(this.jsdocRegex) || [];
        const parsedData = {
            modules: {},
            constants: {},
            functions: {}
        };

        // Check each comment block, process it, and aggregate the doc results.
        jsdocComments.forEach(commentBlock => {
            const cleanedCommentBlock = this.cleanCommentBlock(commentBlock);
            const parsedComment = this.parseComment(cleanedCommentBlock);

            if (parsedComment && parsedComment.entryName) {
                parsedData[parsedComment.entryType + 's'][parsedComment.entryName] = parsedComment;
            }
        });

        return parsedData;
    },

    /**
     * Parses a single JSDoc comment block to extract information.
     * @function parseComment
     * @param {string} comment - The JSDoc comment block to parse.
     * @returns {object|null} An object containing the parsed information from the JSDoc comment, or null if no recognized entry tag is found.
     */
    parseComment(comment) {
        let entryName = null;
        let entryType = null;
        let entryDataType = null;

        // Extract the description before the first @ tag
        const descriptionMatch = comment.match(/^(.+?)(?=@|$)/s);
        const description = descriptionMatch ? descriptionMatch[0].trim() : null;

        // Process the comment block looking for an entry (function, module, constant)
        Object.entries(this.entryRegex).forEach(([type, regex]) => {
            regex.lastIndex = 0; // Reset lastIndex to 0
            const match = regex.exec(comment);
            if (match) {
                entryType = type;
                switch (type) {
                    case 'constant':
                        entryDataType = match[2]; // Capture the data type for constants
                        entryName = match[3]; // Capture the name for constants
                        break;
                    case 'module':
                        entryName = match[1]; // Capture the name for modules
                        break;
                    default:
                        entryName = match[2]; // Capture the name for functions and methods
                        break;
                }
            }
        });

        // Skip comments without a recognized entry tag
        if (!entryName) {
            return null;
        }

        // Create the intial return object
        const details = { entryType, entryName, description, ...(entryDataType ? { dataType: entryDataType } : {}) };

        // Check the rest of the comment for the tags to output.
        for (const [tag, regex] of Object.entries(this.tagRegex)) {
            const matches = [...comment.matchAll(regex)];
            if (!matches.length) continue;

            switch (tag) {
                case 'params':
                    // 'params' expects type, name, and description
                    details[tag] = matches.map(match => ({
                        type: match[2]?.trim(),
                        name: match[3]?.trim(),
                        description: match[4]?.trim()
                    }));
                    break;

                case 'returns':
                    // 'returns' expects type and description, no name
                    details[tag] = matches.map(match => ({
                        type: match[1]?.trim(),
                        description: match[2]?.trim()
                    }));
                    break;

                case 'async':
                    // 'async' is a boolean flag, if the tag is present, the function is async
                    details[tag] = true;
                    break;

                case 'link':
                    // 'link' expects a URL, which is the first capturing group in the regex
                    details[tag] = matches[0][1].trim();
                    break;

                default:
                    // Any other tags that may be added in the future
                    details[tag] = matches.map(match => match[1]?.trim());
                    break;
            }
        }


        return details;
    },

    /**
     * @function cleanCommentBlock Cleans a JSDoc comment block by removing the commenting marks from each line.
     * @param {string} commentBlock - The JSDoc comment block to clean.
     * @returns {string} The cleaned comment block.
     */
    cleanCommentBlock(commentBlock) {
        // Remove the leading /** and trailing */
        commentBlock = commentBlock.replace(/\/\*\*|\*\//g, '').trim();
        // Remove leading * from each line
        commentBlock = commentBlock.replace(/^\s*\*+/gm, '').trim();
        return commentBlock;
    },

    /**
     * Asynchronously fetches JavaScript content from a URL.
     * @function fetchJsContent
     * @param {string} url - The URL to fetch the JavaScript content from.
     * @returns {Promise<string>} A promise that resolves with the fetched JavaScript content as text.
     * @async
     */
    async fetchJsContent(url) {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch JS content from ${url}`);
        }
        return response.text();
    },
};
