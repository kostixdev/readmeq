"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsdoc2md = require("jsdoc-to-markdown");
const src_1 = require("../src");
jsdoc2md
    .render({ files: './build/src/*' })
    .then((output) => {
    (0, src_1.modifyReadmeqSingle)('docsSection', output, {
        n: true,
        backup: true,
    });
})
    .catch((error) => {
    console.error(error);
});
//# sourceMappingURL=build-docs.js.map