"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const promises_1 = require("fs/promises");
const path_1 = require("path");
(async () => {
    const pattern = await index_1.makePattern(path_1.resolve(__dirname, "./test.svg"), 3000, 3000);
    await promises_1.writeFile(path_1.resolve(__dirname, "./testgen.svg"), pattern);
})();
//# sourceMappingURL=test.js.map