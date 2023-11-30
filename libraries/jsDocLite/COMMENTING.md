# jsDocLite Supported tags

## Overview
`jsDocLite` does not offer full JSDoc support. Instead, it supports a subset of docblock tags that can be used to comment your code and auto-generate documentation. The library will return an object with the doc information ([example](#example)), and you can parse that into whatever template or app that you need.

The library supports 3 entries:
- modules
- functions
- constants

For a complete example, see the jsDocLite library [code](./index.js) itself.

## Description
The description for each entry is the first text line _before_ any tags. This makes the code more readable for the developer.
_NOTE: description support is limited, and the library works best with single line descriptions._

## Module
This is a very simple system and really only expects a single module to define the library. This is typically the information about the library itself.
- `@module`

**example**
```js
/**
 * This module provides functionality to parse JSDoc comments from JavaScript code.
 * @module JSDocLite
 */
```

## Functions
Functions can be noted with 3 optional tags - any of the three will work:
- `@function` - expects a name and description
    - _alternative: `@method` or `@func`_

Functions can have a few different tags to describe them. Each tag is slightly different:
- `@params`- expects a type, name, and description
    - _alternative: `@param`, `@arg`, or `@argument`_
- `@returns` - expects a type and description
    - _alternative: `@return` or `@ret`_
- `@async` - this is a boolean tag to mark this as an async function
- `@link` - an optional URL to docs or some other information
    - _alternative: `@doc`_

All tags are optional, but should be used if needed.

**example**
```js
/**
 * Asynchronously fetches JavaScript content from a URL and parses the JSDoc comments.
 * @function parseFromUrl
 * @param {string} url - The URL to fetch the JavaScript content from.
 * @returns {Promise<object>} An object containing the parsed JSDoc comments.
 * @async
 */
```

_NOTE: any functions without a `function/func/method` tag will not be listed at all. This is great for helper functions or other "private" functions that are not intended to be used directly._

## Constants
Constants are quite typically variables declared in the library and are notated with:
- `@constant` - expects a type, name, and description
    - _alternative: `@const`_

**example**
```js
/**
 * Regex to help identify JS Doc blocks in code.
 * @constant {object} jsdocRegex
 */
```

## Example output
Here is an example of the output of the `parse()` method for `jsDocLite` itself:
```js
{
  "modules": {
    "JSDocLite": {
      "entryType": "module",
      "entryName": "JSDocLite",
      "description": "This module provides functionality to parse JSDoc comments from JavaScript code."
    }
  },
  "constants": {
    "entryRegex": {
      "entryType": "constant",
      "entryName": "entryRegex",
      "description": "An object of regex to help identify entries for documentation (functions, constants, and modules).",
      "dataType": "object"
    },
    "tagRegex": {
      "entryType": "constant",
      "entryName": "tagRegex",
      "description": "An object of regex to help identify tags for identified entries.",
      "dataType": "object"
    },
    "jsdocRegex": {
      "entryType": "constant",
      "entryName": "jsdocRegex",
      "description": "Regex to help identify JS Doc blocks in code.",
      "dataType": "object"
    }
  },
  "functions": {
    "parseFromUrl": {
      "entryType": "function",
      "entryName": "parseFromUrl",
      "description": "Asynchronously fetches JavaScript content from a URL and parses the JSDoc comments.",
      "params": [
        {
          "type": "string",
          "name": "url",
          "description": "The URL to fetch the JavaScript content from."
        }
      ],
      "async": [
        {}
      ]
    },
    "parse": {
      "entryType": "function",
      "entryName": "parse",
      "description": "Parses the provided JavaScript code to extract JSDoc comments.",
      "params": [
        {
          "type": "string",
          "name": "code",
          "description": "The JavaScript code to parse."
        }
      ]
    },
    "parseComment": {
      "entryType": "function",
      "entryName": "parseComment",
      "description": "Parses a single JSDoc comment block to extract information.",
      "params": [
        {
          "type": "string",
          "name": "comment",
          "description": "The JSDoc comment block to parse."
        }
      ]
    },
    "cleanCommentBlock": {
      "entryType": "function",
      "entryName": "cleanCommentBlock",
      "description": "@function cleanCommentBlock Cleans a JSDoc comment block by removing the commenting marks from each line.",
      "params": [
        {
          "type": "string",
          "name": "commentBlock",
          "description": "The JSDoc comment block to clean."
        }
      ]
    },
    "fetchJsContent": {
      "entryType": "function",
      "entryName": "fetchJsContent",
      "description": "Asynchronously fetches JavaScript content from a URL.",
      "params": [
        {
          "type": "string",
          "name": "url",
          "description": "The URL to fetch the JavaScript content from."
        }
      ],
      "async": [
        {}
      ]
    }
  }
}
```